import { useState } from "react";
import { DedotClient } from "dedot";
import { Injected, InjectedAccount } from "@polkadot/extension-inject/types";
import { WestendApi } from "@dedot/chaintypes";
import { TxStatus } from "dedot/types";
import { validateAddress } from "../../../utils";

import {
   Stack,
   Input,
   Button,
   useToast
} from "@chakra-ui/react";
import {Props} from "../../../vite-env";

export default function TransferModal({
   client,
   account,
   injected,
   onModalClose
}: Props & {onModalClose: () => void}) {

   const toast = useToast();

   const [destAddress, setDestAddress] = useState<string>("");
   const [transferAmount, setTransferAmount] = useState<string>("");
   const [transferring, setTransferring] = useState<boolean>(false);
   const [txStatus, setTxStatus] = useState<TxStatus>();
   const [transactionError, setTransactionError] = useState<string>("");

   const transfer = async () => {
      if (!destAddress || !validateAddress(destAddress)) {
         toast({
            position: "top",
            title: "Wrong destination address",
            status: "error",
            duration: 7000,
            isClosable: true
         });
         return;
      }

      setTransferring(true);
      if (transactionError) setTransactionError("");
      if (txStatus) setTxStatus(undefined);

      const amountToTransfer = BigInt(parseFloat(transferAmount));
      console.log(client, "client")
      await client?.tx.balances
         .transferKeepAlive(destAddress, amountToTransfer)
         .signAndSend(account.address, { signer: injected.signer }, (result) => {
            setTxStatus(result.status);
            const statusType: string = result.status.type;
            if (statusType === "BestChainBlockIncluded" || statusType === "Finalized") {
               if (result.dispatchError) {
                  toast({
                     position: "top",
                     title: "Transfer failed",
                     status: "error",
                     colorScheme: "red",
                     duration: 7000,
                     isClosable: true
                  })
                  setTransactionError(`${JSON.stringify(Object.values(result.dispatchError))}`);
                  return;
               }
               if (statusType === "Finalized") {
                  toast({
                     position: "top",
                     title: "Transfer success",
                     status: "success",
                     colorScheme: "green",
                     duration: 7000,
                     isClosable: true
                  })
                  onModalClose();
               }
            }
         });
   }

   return (
      <Stack spacing={10}>
         <Input 
            type="text"
            variant='flushed' 
            placeholder='Destination address' 
            focusBorderColor="#d0d4ca"
            value={destAddress}
            onChange={(e) => setDestAddress(e.target.value)} 
         />
         <Input 
            type="number"
            variant='flushed' 
            placeholder='Amount to transfer' 
            focusBorderColor="#d0d4ca"
            value={transferAmount}
            onChange={e => setTransferAmount(e.target.value)} 
         />
         <Button 
            colorScheme="gray" 
            minW="100%" 
            minH={30} 
            isLoading={transferring}
            loadingText={txStatus?.type || "Transfering..."} 
            isDisabled={!destAddress ||!transferAmount || parseFloat(transferAmount) <= 0 || transferring}
            spinnerPlacement="end"
            onClick={transfer}>
            Transfer
         </Button>
      </Stack>
   );
}
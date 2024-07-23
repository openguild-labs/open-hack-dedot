import { useState, useEffect, useCallback, memo } from "react";
import { FrameSystemAccountInfo } from '@dedot/chaintypes/polkadot';
import { formatBalance } from "../utils";
import { WESTEND } from "../networks";
import { TransferModal, IdentityModal } from "./modals";

import { 
   Stack,
   Text, 
   Button, 
   FormControl, 
   Modal, 
   ModalOverlay, 
   ModalContent, 
   ModalBody, 
   useDisclosure
} from "@chakra-ui/react";
import {Props} from "../vite-env";

const modals = {
   transfer: TransferModal,
   identity: IdentityModal
} as const;

type ModalType = keyof typeof modals;

export default function AccountInfo({ client, account, injected }: Props) {

   const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
   const [balance, setBalance] = useState<FrameSystemAccountInfo>();
   const [modal, setModal] = useState<{ type: ModalType, props: any }>();

   useEffect(() => {
      let unsubBalance: any;

      const subscribeBalanceChange = async () => {
         unsubBalance = await client?.query.system.account(
            account.address, 
            (balance: FrameSystemAccountInfo) => setBalance(balance)
         );
      }

      subscribeBalanceChange();

      return () => {
         unsubBalance && unsubBalance();
      }
   }, [account, client]);

   const AccountInfo = useCallback(memo(() => {
      
      const openModal = (modalType: ModalType, props: any) => {
         setModal({ type: modalType, props });
         onModalOpen();
      }

      return (
         <Stack spacing={4} minW={650} p={12} mb={100} rounded="md" border="1px solid gray">
            <Text>Account name: {account.name}</Text>
            <Text>Address: {account.address}</Text>
            <Text>{balance?.data && formatBalance(balance.data.free, WESTEND.decimals)}</Text>
            <Button
               maxW="100%" 
               onClick={() => openModal("transfer", {client, account, injected, onModalClose})}>
               Make transfer
            </Button>
         </Stack>
      );
   }), [account, client, balance]);

   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
   // @ts-expect-error
   const ModalBodyContent = modals[modal?.type];

   return (
      balance?.data &&  
      <>
         <AccountInfo />
         <Modal {...{
            isOpen: isModalOpen, 
            onClose: onModalClose,
            isCentered: true,
            motionPreset: "slideInBottom"
         }}>
            <ModalOverlay backdropFilter="blur(4px)" />
            <ModalContent>
               <ModalBody px={8} py={10}>
                  <FormControl>
                     { ModalBodyContent && <ModalBodyContent {...(modal!.props)} /> }
                  </FormControl>
               </ModalBody>
            </ModalContent>
         </Modal> 
      </> || <></>
   );
}
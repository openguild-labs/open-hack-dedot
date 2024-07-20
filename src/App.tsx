import dedotLogo from './assets/dedot-dark-logo.png';
import { Injected, InjectedAccount, InjectedWindow } from '@polkadot/extension-inject/types';
import { useEffect, useState } from 'react';
import { DedotClient, WsProvider } from 'dedot';
import { FrameSystemAccountInfo } from '@dedot/chaintypes/polkadot';
import { formatBalance, validateAddress } from './utils.ts';
import { Box, Button, Container, Divider, Flex, FormControl, FormLabel, Heading, Input, Text } from '@chakra-ui/react';
import { TxStatus } from 'dedot/types';
import { WestendApi } from '@dedot/chaintypes';
import { WESTEND } from './networks.ts';

function App() {
  const [client, setClient] = useState<DedotClient<WestendApi>>();
  const [injected, setInjected] = useState<Injected>();
  const [account, setAccount] = useState<InjectedAccount>();
  const [balance, setBalance] = useState<FrameSystemAccountInfo>();
  const [dest, setDest] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [txStatus, setTxStatus] = useState<TxStatus>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    (async () => {
      console.log('Connecting to network...');
      const client = new DedotClient<WestendApi>(new WsProvider(WESTEND.endpoint));
      await client.connect();

      setClient(client);
    })();
  }, []);

  useEffect(() => {
    let unsub: any;

    if (client && account) {
      (async () => {
        unsub = await client.query.system.account(account.address, (balance) => {
          setBalance(balance);
        });
      })();
    }

    return () => {
      unsub && unsub();
    };
  }, [client, account]);

  const connectWallet = async () => {
    const injectedWindow = window as Window & InjectedWindow;
    const provider = injectedWindow.injectedWeb3['subwallet-js'];
    const injected = await provider.enable!('Open Hack Dapp');
    const accounts = await injected.accounts.get();
    setAccount(accounts[0]);
    setInjected(injected);
  };

  const makeTransfer = async () => {
    if (!dest || !validateAddress(dest)) {
      window.alert('Wrong address!');
      return;
    }

    setError(undefined);
    setTxStatus(undefined);

    const amountToTransfer = BigInt(parseFloat(amount) * Math.pow(10, WESTEND.decimals));
    await client!.tx.balances
      .transferAllowDeath(dest, amountToTransfer)
      .signAndSend(account!.address, { signer: injected!.signer }, (result) => {
        console.log(result.status);
        setTxStatus(result.status);
        if (result.status.type === 'BestChainBlockIncluded' || result.status.type === 'Finalized') {
          if (result.dispatchError) {
            setError(`${JSON.stringify(Object.values(result.dispatchError))}`);
          }
        }
      });
  };

  const connected = !!client && client.status === 'connected' && !!account?.address;

  return (
    <Container maxW='container.md' my={16}>
      <Flex justifyContent='center'>
        <a href='https://dedot.dev' target='_blank'>
          <img width='100' src={dedotLogo} className='logo' alt='Vite logo' />
        </a>
      </Flex>
      <Heading my={4} textAlign='center'>
        Open Hack Dedot
      </Heading>
      <Box my={4}>
        {account ? (
          <div>
            <Text my={2}>
              Connected Account: <b>{account.name}</b>
            </Text>
            <Text my={2}>
              Address: <b>{account.address}</b>
            </Text>
            <Text my={2}>
              Balance: <b>{balance?.data && formatBalance(balance.data.free, WESTEND.decimals)}</b>
            </Text>
            <Divider my={4} />
            <FormControl>
              <FormLabel>Transfer balance to:</FormLabel>
              <Input type='text' value={dest} onChange={(e) => setDest(e.target.value)} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Amount to transfer:</FormLabel>
              <Input type='number' value={amount} onChange={(e) => setAmount(e.target.value)} />
            </FormControl>
            <Button mt={4} colorScheme='blue' onClick={makeTransfer} isDisabled={!connected}>
              Transfer
            </Button>
            {txStatus && (
              <Text mt={4}>
                Tx Status: <b>{txStatus.type}</b>
              </Text>
            )}
            {error && (
              <Text mt={4} color='red.500'>
                Error: <b>{error}</b>
              </Text>
            )}
          </div>
        ) : (
          <Flex justifyContent='center'>
            <Button colorScheme='blue' onClick={connectWallet}>
              Connect Wallet
            </Button>
          </Flex>
        )}
      </Box>
    </Container>
  );
}

export default App;

import dedotLogo from './assets/dedot-dark-logo.png';
import { Container, Flex, Heading } from '@chakra-ui/react';

function App() {
  // 1. Connect to SubWallet
  // 2. Show connected account (name & address)
  // 3. Initialize `DedotClient` to connect to the network (Westend testnet)
  // 4. Fetch & show balance for connected account
  // 5. Build a form to transfer balance (destination address & amount to transfer)
  // 6. Check transaction status (in-block & finalized)
  // 7. Check transaction result (success or not)
  // 8. Subscribe to balance changing

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
    </Container>
  );
}

export default App;

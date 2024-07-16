import dedotLogo from './assets/dedot-dark-logo.png'
import './App.css'
import { InjectedAccount, InjectedWindow } from "@polkadot/extension-inject/types";
import { useEffect, useState } from "react";
import { DedotClient, WsProvider } from "dedot";
import { FrameSystemAccountInfo } from "@dedot/chaintypes/polkadot";
import { formatBalance } from "./utils.ts";

// const POLKADOT_ENDPOINT = 'wss://rpc.polkadot.io'
const ROCOCO_ENDPOINT = 'wss://rococo-rpc.polkadot.io'

function App() {
  const [client, setClient] = useState<DedotClient>();
  const [account, setAccount] = useState<InjectedAccount>()
  const [balance, setBalance] = useState<FrameSystemAccountInfo>()

  useEffect(() => {
    (async () => {
      console.log('Connecting to network...');
      const client = new DedotClient(new WsProvider(ROCOCO_ENDPOINT));
      await client.connect();

      setClient(client);
    })();
  }, []);

  useEffect(() => {
    if (client && account) {
      (async () => {
        const balance = await client.query.system.account(account.address);
        setBalance(balance);
      })();
    }
  }, [client, account]);

  const connectWallet = async () => {
    const injectedWindow = window as Window & InjectedWindow;
    const provider = injectedWindow.injectedWeb3['subwallet-js'];
    const injected = await provider.enable!('Open Hack Dapp');
    const accounts = await injected.accounts.get();
    setAccount(accounts[0]);
  }

  return (
    <>
      <div>
        <a href="https://dedot.dev" target="_blank">
          <img src={dedotLogo} className="logo" alt="Vite logo"/>
        </a>
      </div>
      <h1>Open Hack Dedot</h1>
      <div className="card">
        {account ?
          (<div>
            <p>Connected account: {account.address}</p>
            <p>Balance: {balance?.data && formatBalance(balance.data.free, 12)}</p>

          </div>) :
          (<button onClick={connectWallet}>
            Connect Wallet
          </button>)
        }

      </div>
    </>
  )
}

export default App

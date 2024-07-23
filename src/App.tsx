import { useState, useEffect } from "react";
import { DedotClient, WsProvider } from "dedot";
import {Injected, InjectedAccount, InjectedWindow, InjectedWindowProvider} from '@polkadot/extension-inject/types';
import { WestendApi } from "@dedot/chaintypes";
import { WESTEND } from "./networks";
import {Button, Flex} from "@chakra-ui/react"
import AccountInfo from "./components/AccountInfo";
import {Props} from "./vite-env";

export default function Result() {

    const [client, setClient] = useState<DedotClient<WestendApi>>();
    const [injected, setInjected] = useState<Injected>();
    const [account, setAccount] = useState<InjectedAccount>();
    const [connecting, setConnecting] = useState(false);

    const collectWallet = async () => {
        setConnecting(true);
        const injectedWindow = window as Window & InjectedWindow;
        const provider: InjectedWindowProvider = injectedWindow.injectedWeb3['subwallet-js'];
        const injected: Injected = await provider.enable!("Open Hack Dedot");
        const accounts: InjectedAccount[] = await injected.accounts.get();
        setAccount(accounts[0]);
        setInjected(injected);
        setConnecting(false);
    }

    useEffect(() => {
        const connectNetwork = async () => {
            const client = await (new DedotClient<WestendApi>(new WsProvider(WESTEND.endpoint))).connect();
            setClient(client);
        }
        connectNetwork();

        return () => {
            const disconnectNetwork = async () => {
                await client?.disconnect();
            }
            disconnectNetwork();
        }
    }, []);

    const isClientConnected =  client ?? status === "connected"
    const isConnectedAccount = isClientConnected && injected && !!account?.address;
    console.log(account, "Connect", isConnectedAccount)
    return (
        <Flex minW="100vw" minH="100vh" justifyContent="center" alignItems="center">
            { isConnectedAccount ?
                <AccountInfo {...{ client, account, injected } as Props} /> :
                <Button
                    onClick={collectWallet}
                    isLoading={connecting}
                    loadingText={"Connecting Wallet"}
                >
                    Connect Wallet
                </Button>
            }
        </Flex>
    );
}
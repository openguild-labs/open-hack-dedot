/// <reference types="vite/client" />
import {DedotClient} from "dedot";
import {WestendApi} from "@dedot/chaintypes";
import {Injected, InjectedAccount} from "@polkadot/extension-inject/types";

interface Props {
    client?: DedotClient<WestendApi>;
    account: InjectedAccount;
    injected: Injected;
}
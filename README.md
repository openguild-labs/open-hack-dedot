# OpenHack Workshop - Dedot

![2024-07-18 16 17 02](https://github.com/user-attachments/assets/16da307d-2cd3-42a7-bc03-c3470978d77a)

Made by the collaboration between [OpenGuild Labs](https://openguild.wtf) and [Dedot](https://dedot.dev) to introduce to participants about building decentralized applications on Polkadot.

[Slide Content](https://docs.google.com/presentation/d/1FNEy4griCqPOmQjjjNkjbth04K2KFPgs/edit?usp=sharing&ouid=101569412264936116370&rtpof=true&sd=true)

## Main Activity: Live Coding Session

🎯 Build a simple dapp to show & transfer balance on Polkadot testnet

### 1. Install SubWallet & create your wallet account
- Install SubWallet Extension: https://www.subwallet.app/download.html
- Create your first wallet
- Enable Polkadot testnet: Rococo & Westend
<p float="left">
<img float="left" width="200" alt="Xnapper-2024-07-18-21 55 02" src="https://github.com/user-attachments/assets/df3625ec-2103-4b80-9e19-7fbd618da859">
<img float="left" width="200" alt="Xnapper-2024-07-18-21 55 52" src="https://github.com/user-attachments/assets/9dc271e1-74f6-47c6-8f5c-595b6b9f578b">
<img float="left" width="200" alt="Xnapper-2024-07-18-21 55 33" src="https://github.com/user-attachments/assets/4895a38f-cc19-4b1f-86b6-6681fea2a2dd">
</p>


- Claim testnet token from faucet: https://faucet.polkadot.io/
<p float="left">
<img float="left" width="250" alt="Xnapper-2024-07-18-22 00 14" src="https://github.com/user-attachments/assets/97ce3d78-ac8d-48eb-819c-059d3a989721">
<img float="left" width="350" alt="Xnapper-2024-07-18-22 01 16" src="https://github.com/user-attachments/assets/eb37ac35-a314-4733-97ac-614a1c47019d">
</p>

### 2. Install Node.js

- Follow instruction at: https://nodejs.org/en/download/package-manager
- Or install via nvm:
```shell
# installs nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# download and install Node.js (you may need to restart the terminal)
nvm install 20

# verifies the right Node.js version is in the environment
node -v # should print `v20.15.1`

# verifies the right NPM version is in the environment
npm -v # should print `10.7.0`
```

### 3. Fork, clone the repo

- Fork the repo
<img width="800" alt="Xnapper-2024-07-18-22 10 30" src="https://github.com/user-attachments/assets/c8be2790-e75f-488b-9e43-b2e7726ffa77">

- Clone the repo
```shell
git clone https://github.com/{your-github-username}/openhack-dedot
```
E.g: `https://github.com/sinzii/openhack-dedot`

### 4. Install dependencies & start development mode

- Install dependencies
```shell
npm i
```

- Start development mode
```shell
npm run dev
```
- The development application starts at: http://localhost:5173
  

### 5. Start building the dapp

- [ ] Connect to wallet
- [ ] Show connected account (name & address)
- [ ] Initialize `DedotClient` to connect to the network (Westend testnet)
- [ ] Fetch & show balance for connected account
- [ ] Build a form to transfer balance (destination address & amount to transfer)
- [ ] Check transaction status (in-block & finalized)
- [ ] Check transaction result (success or not)
- [ ] Subscribe to balance changing

### 6. How to interact with the network via Dedot?

#### 6.1 Install dedot and necessary dependencies

```typescript
npm i dedot

npm i -D @dedot/chaintypes @polkadot/extension-inject
```

#### 6.2 Connect to SubWallet & fetch connected accounts

```typescript
import { Injected, InjectedAccount, InjectedWindowProvider, InjectedWindow } from '@polkadot/extension-inject/types';

const injectedWindow = window as Window & InjectedWindow;

// Get subwallet-js injected provider to connect with SubWallet
const provider: InjectedWindowProvider = injectedWindow.injectedWeb3['subwallet-js'];

// Connect with SubWallet from the dapp
const injected: Injected = await provider.enable!('Open Hack Dapp');

// Get connected accounts
const accounts: InjectedAccount[] = await injected.accounts.get();
```

#### 6.3 Initialize `DedotClinet` to connect to `Westend` network

```typescript
import { DedotClient, WsProvider } from 'dedot';
import { WestendApi } from '@dedot/chaintypes';
import { WESTEND } from './networks.ts';

// initialize the client and connect to the network
const client = new DedotClient<WestendApi>(new WsProvider(WESTEND.endpoint));
await client.connect();

// OR via static factory
const client = await DedotClient.new<WestendApi>(new WsProvider(WESTEND.endpoint));
```

#### 6.4 Fetching balance for an account

```typescript
import { FrameSystemAccountInfo } from '@dedot/chaintypes/westend';
import { formatBalance } from './utils.ts';
import { WESTEND } from './networks.ts';

const account: InjectedAccount = accounts[0]; // get from accounts list - 6.2
const balance: FrameSystemAccountInfo = await client.query.system.account(account.address);

// Get free/transferable balance
const freeBalance = formatBalance(balance.data.free, WESTEND.decimals);
```

#### 6.5 Transfer balance to destination address

```typescript
import { Injected, InjectedAccount } from '@polkadot/extension-inject/types';

const client: DedotClinet = ...;

// Get injected instance & connected account - 6.2
const injected: Injected = ...; 
const account: InjectedAccount = ...;

const amount: number = 1; // how many token in DOT or WND

// Convert the amount (DOT, or WND) to Planck unit
const amountToTransfer: bigint = BigInt(amount) * BigInt(Math.pow(10, WESTEND.decimals));
const destAddress: string = '...';

await client.tx.balances
      .transferKeepAlive(destAddress, amountToTransfer)
      .signAndSend(account.address, { signer: injected.signer }, (result) => {
        console.log(result.status);

        // 'BestChainBlockIncluded': Transaction is included in the best block of the chain
        // 'Finalized': Transaction is finalized  
        if (result.status.type === 'BestChainBlockIncluded' || result.status.type === 'Finalized') {
          if (result.dispatchError) {
            // Transaction is included but has an error
            const error = `${JSON.stringify(Object.values(result.dispatchError))}`;
          } else {
            // Transaction is included and executed successfully
          }
        }
      });

```

#### 6.6 Subscribe to balance changing

```typescript
import { FrameSystemAccountInfo } from '@dedot/chaintypes/westend';
import { formatBalance } from './utils.ts';
import { WESTEND } from './networks.ts';

const account: InjectedAccount = accounts[0]; // get from accounts list - 6.2

// Pass in a callback to be called whenver the balance is changed/updated
const unsub = await client.query.system.account(account.address, (balance: FrameSystemAccountInfo) => {
  // Get free/transferable balance
  const freeBalance = formatBalance(balance.data.free, WESTEND.decimals);   
});
```

## Challenge: Set your on-chain identity

Prerequisite: Complete the main activity

- [ ] Initialize `DedotClient` to connect to Westend People testnet ([`WestendPeopleApi`](https://github.com/dedotdev/chaintypes/blob/7baa48e8e8e3c8e2dce4ad9ece0a11b9ae98934a/packages/chaintypes/src/westendPeople/index.d.ts#L24))
- [ ] Build a form to enter identity information: Display name, Email, Discord handle
- [ ] Make a transaction to set on-chain identity for connected account (via [`client.tx.identity.setIdentity`](https://github.com/dedotdev/chaintypes/blob/7baa48e8e8e3c8e2dce4ad9ece0a11b9ae98934a/packages/chaintypes/src/westendPeople/tx.d.ts#L2283-L2295))
- [ ] Fetch & render your on-chain identity (via [`client.query.identity.identityOf`](https://github.com/dedotdev/chaintypes/blob/7baa48e8e8e3c8e2dce4ad9ece0a11b9ae98934a/packages/chaintypes/src/westendPeople/query.d.ts#L1130-L1134))
- [ ] If connected account is already set on-chain identity, show the identity information instead the form

A bounty of 2 DOT to claim for the first 5 participants to submit the challenge to OpenGuild

### 🙋 How to claim the bounty?
👉 Complete the challenge on your fork repository <br/>
👉 Star Dedot repository <br/>
👉 Follow OpenGuild Lab Github <br/>
👉 Join OpenGuild Discord <br/>
👉 Submit the proof-of-work (your challenge repository) to OpenGuild Discord <br/>

---
# 🙌 How to contribute to the community?

To submit a proposal, ideas, or any questions, please submit them here: [OpenGuild Discussion 💬](https://github.com/orgs/openguild-labs/discussions)
View tickets and activities that you can contribute: [Community Activities 🖐️](https://github.com/orgs/openguild-labs/discussions/categories/activities)

- **Help to grow the community:** Community growth is a collective effort. By actively engaging with and inviting fellow enthusiasts to join our community, you play a crucial role in expanding our network. Encourage discussions, share valuable insights, and foster a welcoming environment for newcomers.

- **Participate in workshops and events:** Be an active participant in our workshops and events. These sessions serve as valuable opportunities to learn, collaborate, and stay updated on the latest developments in the Polkadot ecosystem. Through participation, you not only enhance your knowledge but also contribute to the collaborative spirit of OpenGuild. Share your experiences, ask questions, and forge connections with like-minded individuals.

- **Propose project ideas:** Your creativity and innovation are welcomed at OpenGuild. Propose project ideas that align with the goals of our community. Whether it's a new application, a tool, or a solution addressing a specific challenge in the Polkadot ecosystem, your ideas can spark exciting collaborations.

- **Contribute to our developer tools:** Get involved in the ongoing development and improvement of tools that aid developers in their projects. Whether it's through code contributions, bug reports, or feature suggestions, your involvement in enhancing these tools strengthens the foundation for innovation within OpenGuild and the broader Polkadot community.


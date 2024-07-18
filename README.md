# OpenHack Workshop - Dedot

![2024-07-18 16 17 02](https://github.com/user-attachments/assets/16da307d-2cd3-42a7-bc03-c3470978d77a)

Made by the collaboration between [OpenGuild Labs](https://openguild.wtf) and [Dedot](https://dedot.dev) to introduce to participants about building decentralized applications on Polkadot.

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

### 6. How to?

#### Install dedot and necessary dependencies

```typescript
npm i dedot

npm i -D @dedot/chaintypes @polkadot/extension-inject
```

#### Connect to SubWallet & fetch connected accounts

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

#### Initialize `DedotClinet` to connect to `Westend` network

```typescript
import { WestendApi } from '@dedot/chaintypes';
import { WESTEND } from './networks.ts';

const client = new DedotClient<WestendApi>(new WsProvider(WESTEND.endpoint));
await client.connect();

// OR
const client = await DedotClient.new<WestendApi>(new WsProvider(WESTEND.endpoint));
```

#### Fetching balance for an account

#### Transfer balance to destination address

#### Subscribe to balance changing

## Challenge: Set your on-chain identity

Prerequisite: Complete the main activity

- [ ] Initialize `DedotClient` to connect to Westend People testnet
- [ ] Build a form to enter identity information: Display name, Email, Discord handle
- [ ] Make a transaction to set on-chain identity for connected account
- [ ] Fetch & render your on-chain identity
- [ ] If connected account is already set on-chain identity, show the identity information instead the form

A bounty of 2 DOT to claim for the first 5 participants to submit the challenge to OpenGuild

### 🙋 How to claim the bounty?
- `TODO`

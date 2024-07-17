# Open Hack Dedot

Made by the collaboration between [OpenGuild Labs](https://openguild.wtf) and [Dedot](https://dedot.dev) to introduce participants about building decentralized application on Polkadot.

## Main Activity: Live Coding Session

🎯 Build a simple dapp to show & transfer balance on Polkadot testnet

### 1. Install SubWallet & create your wallet account
- Install SubWallet Extension: https://www.subwallet.app/download.html
- Create your first wallet
- Enable Polkadot testnet: Rococo & Westend
- Claim testnet token from faucet: https://faucet.polkadot.io/

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
- Clone the repo
```shell
git clone https://github.com/openguild-labs/openhack-dedot
```


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

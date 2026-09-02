# Arc Wallet

Arc Wallet is a standalone, non-custodial multi-chain EVM wallet focused on secure wallet creation, local key protection, asset management, sending, receiving, swaps, and transaction history.

## Product direction

Arc Wallet is intentionally **not an exchange, prediction platform, staking app, perpetuals terminal, or Web3 super-app**. The product is being built around one job: giving users a simple interface for controlling their own crypto wallet.

### Core features

- 🔐 Local self-custody wallet creation
- 🧩 BIP-39 recovery phrase generation
- 🎛️ Choose from securely generated recovery-phrase options
- 🔒 Encrypted local wallet vault using Web Crypto AES-GCM + PBKDF2
- 📥 Wallet import (planned)
- 🔑 Password-protected wallet unlock (planned)
- 📤 Send native assets and tokens
- 📥 Receive assets and QR support
- 🪙 Token asset management
- 📜 Transaction history
- 🌐 Multi-network EVM support
- 🔄 Token swaps as a wallet utility
- 🛡️ Security-first architecture
- 📴 Offline/air-gapped signing is planned as a future capability

## Security model

Recovery phrases and private keys are wallet secrets. Arc Wallet must never send them to an Arc backend, analytics service, GitHub, Supabase, Vercel environment variable, or any third-party API.

The current wallet-creation flow generates the recovery phrase locally and stores only an encrypted vault in browser local storage. Encryption uses the browser Web Crypto API with AES-GCM and a PBKDF2-derived 256-bit key. The plaintext recovery phrase is not persisted by the vault layer.

**Important:** this is an evolving wallet implementation. Users should not treat an experimental build as production-grade custody software until the complete vault, unlock, signing, recovery, backup, and security-audit layers are finished.

## Wallet creation flow

1. Generate three cryptographically random BIP-39 recovery phrases locally.
2. Let the user select the phrase they prefer.
3. Require the user to acknowledge the recovery phrase backup warning.
4. Require a local wallet password.
5. Encrypt the recovery phrase with AES-GCM using a PBKDF2-derived key.
6. Store the encrypted vault locally on the device.
7. Derive and display the EVM wallet address.

Users should write down the recovery phrase and keep it offline. Anyone who obtains it can control the wallet.

## Architecture

```text
User device
   │
   ├── Wallet UI
   ├── BIP-39 wallet generation
   ├── Encrypted local vault
   └── Transaction signing
           │
           ▼
      Blockchain RPCs
           │
     ┌─────┼─────┐
     ▼     ▼     ▼
  Ethereum Base  Other EVM networks
```

RPC providers may be used for reading blockchain state and broadcasting signed transactions. They must never receive the user's seed phrase or private key.

## Supported Arc network

The existing project includes Arc Testnet configuration:

- Chain ID: `5042002`
- RPC: `https://rpc.testnet.arc.network`
- Explorer: `https://testnet.arcscan.app`

Additional EVM networks can be configured through the wallet network layer.

## Development

```bash
npm install --legacy-peer-deps
npm run dev
npm run build
```

Open `http://localhost:3000` after starting the development server.

## Environment variables

Only public network/application configuration should use `NEXT_PUBLIC_*` variables. Never put recovery phrases, private keys, passwords, or other wallet secrets in environment variables.

Example:

```env
NEXT_PUBLIC_ARC_RPC=https://rpc.testnet.arc.network
NEXT_PUBLIC_ARC_CHAIN_ID=5042002
NEXT_PUBLIC_ARC_EXPLORER=https://testnet.arcscan.app
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Server-side integrations may use provider/API credentials where required, but wallet secrets must remain local to the user's device.

## Roadmap

- [x] Standalone wallet product direction
- [x] Local recovery phrase generation
- [x] Secure phrase selection flow
- [x] Encrypted local vault foundation
- [ ] Wallet unlock/session management
- [ ] Wallet import and recovery
- [ ] Local transaction signing
- [ ] Send/receive connected to the local wallet
- [ ] Token approvals and ERC-20 transfers
- [ ] Transaction history/indexing
- [ ] Hardware wallet support
- [ ] QR-based offline signing
- [ ] Security review and production hardening
- [ ] Mobile/PWA experience

## Removed from the product direction

Arc Wallet no longer presents prediction markets, perpetuals, staking, AI-agent trading, or unrelated Arc/Circle application modules as core wallet features.

## License

MIT

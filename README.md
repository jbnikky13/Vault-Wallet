# ARC Wallet — Arc Network Agent & Payment Wallet

A composable Web3 wallet for Circle's Arc ecosystem. The current build combines Circle Developer Controlled Wallets with an Arc-native dashboard for Agent Wallets, Gateway, nanopayments, CCTP and Paymaster flows.

## Current primitives

| Primitive | Location | Purpose |
|---|---|---|
| Circle Wallet factory | `src/app/api/wallet/create/` | Create developer-controlled SCA wallets on Arc Testnet |
| AI Agent loop | `src/app/api/agent/` | Analyze → execute cycle for agent workflows |
| Agent Stack dashboard | `src/app/arc-stack/` | Surface current Circle agent/payment primitives |
| Arc configuration | `src/lib/arc.ts` | Central Arc Testnet, Gateway, CCTP and Paymaster configuration |
| x402 middleware | `src/middleware.ts` | HTTP payment-gated API pattern |
| Swap | `src/app/api/swap/` | Token swap pattern |
| Prediction | `src/app/api/predict/` | Prediction market pattern |
| Staking | `src/app/api/stake/` | Staking pattern |
| NFT marketplace | `src/app/api/nft/` | NFT listing pattern |

## New Arc / Circle capabilities surfaced

- **Agent Wallets:** wallets for AI agents with programmable spending policies and user custody.
- **Gateway:** unified USDC liquidity across supported chains and programmable authorization.
- **Nanopayments:** gas-free USDC payments down to $0.000001 through batched Gateway settlement.
- **CCTP:** canonical cross-chain USDC movement and liquidity consolidation.
- **Paymaster:** infrastructure for sponsored transaction experiences.
- **USYC:** tokenized Treasury infrastructure on Arc Testnet.

The app intentionally keeps secrets server-side. API keys, entity secrets and private keys must never be exposed through `NEXT_PUBLIC_*` variables or client components.

## Arc Testnet

- Chain ID: `5042002`
- Chain code: `ARC-TESTNET`
- Gateway domain: `26`
- RPC: `https://rpc.testnet.arc.network`
- Explorer: `https://testnet.arcscan.app`
- Gateway Testnet API: `https://gateway-api-testnet.circle.com`

## Environment variables

```env
CIRCLE_API_KEY=TEST_API_KEY:key_id:key_secret
CIRCLE_ENTITY_SECRET=your_64_char_hex
ANTHROPIC_API_KEY=sk-ant-your-key-here
NEXT_PUBLIC_ARC_RPC=https://rpc.testnet.arc.network
NEXT_PUBLIC_ARC_CHAIN_ID=5042002
NEXT_PUBLIC_ARC_EXPLORER=https://testnet.arcscan.app
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Development

```bash
npm install --legacy-peer-deps
npm run dev
npm run build
```

## Live demo

https://arc-wallet-dev.vercel.app

## Official references

- Circle Agent Stack: https://developers.circle.com/agent-stack
- Agent Wallets: https://developers.circle.com/agent-stack/agent-wallets
- Gateway: https://developers.circle.com/gateway
- Nanopayments: https://developers.circle.com/gateway/nanopayments
- Arc: https://www.circle.com/blog/introducing-arc-an-open-layer-1-blockchain-purpose-built-for-stablecoin-finance

## License

MIT

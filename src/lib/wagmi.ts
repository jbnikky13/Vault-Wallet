import { createConfig, http } from "wagmi";
import { defineChain } from "viem";

// Arc Wallet supports a curated MetaMask-style multi-network EVM selector.
// Network data is kept here so adding/removing a network is a single change.
export const arcTestnet = defineChain({
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: { name: "USD Coin", symbol: "USDC", decimals: 6 },
  rpcUrls: { default: { http: ["https://rpc.testnet.arc.network"] } },
  blockExplorers: { default: { name: "ArcScan", url: "https://testnet.arcscan.app" } },
  testnet: true,
});

export const ethereum = defineChain({
  id: 1,
  name: "Ethereum",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://cloudflare-eth.com"] } },
  blockExplorers: { default: { name: "Etherscan", url: "https://etherscan.io" } },
});

export const base = defineChain({
  id: 8453,
  name: "Base",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://mainnet.base.org"] } },
  blockExplorers: { default: { name: "BaseScan", url: "https://basescan.org" } },
});

export const polygon = defineChain({
  id: 137,
  name: "Polygon",
  nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
  rpcUrls: { default: { http: ["https://polygon-rpc.com"] } },
  blockExplorers: { default: { name: "PolygonScan", url: "https://polygonscan.com" } },
});

export const arbitrum = defineChain({
  id: 42161,
  name: "Arbitrum One",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://arb1.arbitrum.io/rpc"] } },
  blockExplorers: { default: { name: "Arbiscan", url: "https://arbiscan.io" } },
});

export const optimism = defineChain({
  id: 10,
  name: "OP Mainnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://mainnet.optimism.io"] } },
  blockExplorers: { default: { name: "Optimism Explorer", url: "https://optimistic.etherscan.io" } },
});

export const bsc = defineChain({
  id: 56,
  name: "BNB Smart Chain",
  nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  rpcUrls: { default: { http: ["https://bsc-dataseed.binance.org"] } },
  blockExplorers: { default: { name: "BscScan", url: "https://bscscan.com" } },
});

export const avalanche = defineChain({
  id: 43114,
  name: "Avalanche",
  nativeCurrency: { name: "Avalanche", symbol: "AVAX", decimals: 18 },
  rpcUrls: { default: { http: ["https://api.avax.network/ext/bc/C/rpc"] } },
  blockExplorers: { default: { name: "SnowTrace", url: "https://snowtrace.io" } },
});

export const supportedChains = [
  arcTestnet,
  ethereum,
  base,
  polygon,
  arbitrum,
  optimism,
  bsc,
  avalanche,
] as const;

export const wagmiConfig = createConfig({
  chains: supportedChains,
  transports: Object.fromEntries(
    supportedChains.map((chain) => [chain.id, http()]),
  ) as Record<(typeof supportedChains)[number]["id"], ReturnType<typeof http>>,
});

import { supportedChains } from "./wagmi";

export type WalletNetwork = (typeof supportedChains)[number];

export const NETWORKS = supportedChains.map((chain) => ({
  id: chain.id,
  name: chain.name,
  symbol: chain.nativeCurrency.symbol,
  decimals: chain.nativeCurrency.decimals,
  rpcUrl: chain.rpcUrls.default.http[0],
  explorerUrl: chain.blockExplorers?.default.url,
  testnet: Boolean(chain.testnet),
}));

export function getNetwork(chainId: number) {
  return NETWORKS.find((network) => network.id === chainId);
}

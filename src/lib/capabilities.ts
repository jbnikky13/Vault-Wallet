import { getNetwork, NETWORKS } from "./networks";

export type FeatureKey = "wallet" | "assets" | "history" | "send" | "receive" | "swap" | "gateway" | "cctp" | "agent" | "perps" | "predict" | "stake";
export type CapabilityStatus = "supported" | "provider" | "unsupported";
export type NetworkCapabilities = Record<FeatureKey, CapabilityStatus>;

// Protocol features are deliberately capability-aware. Basic wallet operations
// work on every configured EVM chain; protocol features are enabled only where
// an integration/provider can actually execute them.
const baseCapabilities: NetworkCapabilities = {
  wallet: "supported", assets: "supported", history: "supported", send: "supported", receive: "supported",
  swap: "provider", gateway: "provider", cctp: "provider", agent: "supported", perps: "provider", predict: "provider", stake: "provider",
};

export const NETWORK_CAPABILITIES: Record<number, NetworkCapabilities> = Object.fromEntries(
  NETWORKS.map((network) => [network.id, { ...baseCapabilities }]),
);

// Circle CCTP V2 currently lists Ethereum, Arbitrum, Avalanche, Base, OP Mainnet
// and Polygon PoS among its supported blockchains. BNB and Arc Testnet are not
// marked CCTP-ready here until a live supported deployment/provider is configured.
for (const chainId of [1, 42161, 43114, 8453, 10, 137]) {
  if (NETWORK_CAPABILITIES[chainId]) NETWORK_CAPABILITIES[chainId].cctp = "provider";
}

export function getCapabilities(chainId: number): NetworkCapabilities {
  return NETWORK_CAPABILITIES[chainId] ?? {
    wallet: "unsupported", assets: "unsupported", history: "unsupported", send: "unsupported", receive: "unsupported",
    swap: "unsupported", gateway: "unsupported", cctp: "unsupported", agent: "unsupported", perps: "unsupported", predict: "unsupported", stake: "unsupported",
  };
}

export function canUseFeature(chainId: number, feature: FeatureKey) {
  return getCapabilities(chainId)[feature] !== "unsupported";
}

export function capabilityLabel(status: CapabilityStatus) {
  if (status === "supported") return "Available";
  if (status === "provider") return "Provider required";
  return "Not available on this network";
}

export function networkFor(chainId: number) {
  return getNetwork(chainId);
}

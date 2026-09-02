export const ARC_TESTNET = {
  chainId: 5042002,
  chainCode: "ARC-TESTNET",
  gatewayDomain: 26,
  rpcUrl: "https://rpc.testnet.arc.network",
  explorerUrl: "https://testnet.arcscan.app",
  gatewayApiUrl: "https://gateway-api-testnet.circle.com",
  gatewayWallet: "0x0077777d7EBA4688BDeF3E311b846F25870A19B9",
  paymaster: "0x31BE08D380A21fc740883c0BC434FcFc88740b58",
  cctpDomain: 26,
};

export const ARC_STACK_FEATURES = [
  {
    id: "agent-wallet",
    name: "Agent Wallets",
    description: "Give AI agents a user-controlled wallet with programmable spending limits.",
    status: "Ready",
    href: "/agent",
  },
  {
    id: "gateway",
    name: "Gateway",
    description: "Unified USDC liquidity and programmable authorization for smart wallets.",
    status: "Ready",
    href: "/arc-stack",
  },
  {
    id: "nanopayments",
    name: "Nanopayments",
    description: "Gas-free USDC payments down to $0.000001 using batched settlement.",
    status: "Ready",
    href: "/arc-stack#nanopayments",
  },
  {
    id: "cctp",
    name: "CCTP",
    description: "Move native USDC between supported chains and consolidate liquidity on Arc.",
    status: "Ready",
    href: "/arc-stack#crosschain",
  },
  {
    id: "paymaster",
    name: "Paymaster",
    description: "Explore gas-sponsored transaction flows for supported Arc Testnet operations.",
    status: "Ready",
    href: "/arc-stack#paymaster",
  },
  {
    id: "usyc",
    name: "USYC",
    description: "Surface tokenized Treasury infrastructure available on Arc Testnet.",
    status: "Preview",
    href: "/arc-stack#usyc",
  },
] as const;

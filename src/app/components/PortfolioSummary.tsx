"use client";

import { useMemo, useState } from "react";
import { useAccount, useBalance, useChainId } from "wagmi";
import { formatUnits } from "viem";
import { NETWORKS } from "@/lib/networks";

export function PortfolioSummary() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [refresh, setRefresh] = useState(0);
  const network = useMemo(() => NETWORKS.find((n) => n.id === chainId) ?? NETWORKS[0], [chainId]);
  const balance = useBalance({ address, chainId, query: { staleTime: 15_000 + refresh } });
  if (!isConnected) return null;
  const formattedBalance = balance.data ? Number(formatUnits(balance.data.value, balance.data.decimals)).toLocaleString(undefined, { maximumFractionDigits: 6 }) : "…";
  return <section className="mb-8 rounded-2xl border border-[#63caff22] bg-gradient-to-br from-[#0c1828] to-[#0c1020] p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-mono uppercase tracking-widest text-[#5b7a99]">Portfolio · {network.name}</p><h2 className="mt-2 text-3xl font-black">{formattedBalance} <span className="text-base text-[#63caff]">{network.symbol}</span></h2><p className="mt-2 text-xs text-[#5b7a99]">Native balance. Token USD values appear in Token Assets when a market-data match exists.</p></div><button onClick={() => setRefresh((x) => x + 1)} className="rounded-xl border border-[#ffffff12] px-3 py-2 text-xs font-bold">Refresh</button></div></section>;
}

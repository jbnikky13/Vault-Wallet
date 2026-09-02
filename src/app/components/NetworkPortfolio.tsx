"use client";

import { useMemo } from "react";
import { useAccount, useBalance } from "wagmi";
import { NETWORKS } from "@/lib/networks";

function NetworkBalance({ network }: { network: (typeof NETWORKS)[number] }) {
  const { address } = useAccount();
  const { data, isLoading } = useBalance({ address, chainId: network.id });
  return (
    <div className="rounded-xl border border-[#ffffff10] bg-[#060810] p-4">
      <div className="flex items-center justify-between gap-3">
        <div><p className="font-bold text-sm">{network.name}</p><p className="text-[10px] font-mono text-[#5b7a99]">{network.symbol} · {network.id}</p></div>
        <span className={`h-2 w-2 rounded-full ${network.testnet ? "bg-[#f5c842]" : "bg-[#00ffa3]"}`} />
      </div>
      <p className="mt-3 text-xl font-black">{isLoading ? "…" : data ? Number(data.formatted).toLocaleString(undefined, { maximumFractionDigits: 6 }) : "0"} <span className="text-xs text-[#63caff]">{network.symbol}</span></p>
    </div>
  );
}

export function NetworkPortfolio() {
  const { isConnected } = useAccount();
  const networks = useMemo(() => NETWORKS, []);
  if (!isConnected) return null;
  return (
    <section className="mb-8 rounded-2xl border border-[#ffffff10] bg-[#0c1020] p-6">
      <div className="mb-5 flex items-center justify-between"><div><h2 className="text-xl font-bold">Network portfolio</h2><p className="mt-1 text-xs text-[#5b7a99]">Live native balances across enabled EVM networks.</p></div><span className="rounded-full border border-[#63caff33] px-2 py-1 text-[10px] font-mono text-[#63caff]">{networks.length} NETWORKS</span></div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">{networks.map((network) => <NetworkBalance key={network.id} network={network} />)}</div>
    </section>
  );
}

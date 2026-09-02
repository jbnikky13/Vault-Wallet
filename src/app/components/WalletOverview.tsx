"use client";

import { useMemo } from "react";
import { useAccount, useBalance, useChainId } from "wagmi";
import { NETWORKS } from "@/lib/networks";

export function WalletOverview() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance, isLoading } = useBalance({ address });

  const active = useMemo(
    () => NETWORKS.find((network) => network.id === chainId) ?? NETWORKS[0],
    [chainId],
  );

  if (!isConnected) return null;

  return (
    <section className="mb-8 rounded-2xl border border-[#ffffff10] bg-[#0c1020] p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#5b7a99]">Current network</p>
          <h2 className="mt-1 text-xl font-black">{active.name}</h2>
          <p className="mt-1 break-all font-mono text-xs text-[#5b7a99]">{address}</p>
        </div>
        <div className="md:text-right">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#5b7a99]">Native balance</p>
          <p className="mt-1 text-3xl font-black">
            {isLoading ? "Loading…" : balance ? Number(balance.formatted).toLocaleString(undefined, { maximumFractionDigits: 6 }) : "0"}
            <span className="ml-2 text-sm text-[#63caff]">{active.symbol}</span>
          </p>
        </div>
      </div>
    </section>
  );
}

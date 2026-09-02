"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { formatUnits } from "viem";
import { NETWORKS } from "@/lib/networks";

type Transfer = { hash: string; blockNumber: number; token: string; from: string; to: string; value: string; type: "send" | "receive"; explorerUrl: string };

export function TransactionHistory() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const active = useMemo(() => NETWORKS.find((n) => n.id === chainId) ?? NETWORKS[0], [chainId]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    if (!address) return;
    setLoading(true); setError("");
    try {
      const res = await fetch(`/api/wallet/history?address=${address}&chainId=${chainId}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "History unavailable");
      setTransfers(json.transfers || []);
    } catch (e) { setError(e instanceof Error ? e.message : "History unavailable"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [address, chainId]);
  if (!isConnected) return null;

  return <section className="mb-8 rounded-2xl border border-[#ffffff10] bg-[#0c1020] p-6">
    <div className="mb-5 flex items-center justify-between gap-4"><div><h2 className="text-xl font-bold">Transaction history</h2><p className="mt-1 text-xs text-[#5b7a99]">On-chain ERC-20 transfer activity for the connected address.</p></div><button onClick={load} disabled={loading} className="rounded-xl border border-[#ffffff12] px-3 py-2 text-xs font-bold disabled:opacity-50">{loading ? "Refreshing…" : "Refresh"}</button></div>
    {error ? <div className="rounded-xl border border-[#ff4d6d33] bg-[#ff4d6d08] p-4 text-xs font-mono text-[#ff4d6d]">{error}</div> : transfers.length === 0 && !loading ? <div className="rounded-xl border border-[#ffffff08] bg-[#060810] p-8 text-center text-sm text-[#5b7a99]">No ERC-20 transfers found in the recent scan window on {active.name}.</div> : <div className="space-y-2">{transfers.map((tx, i) => <a key={`${tx.hash}-${i}`} href={tx.explorerUrl} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-xl border border-[#ffffff08] bg-[#060810] p-4 hover:border-[#63caff33] transition-colors"><span className={`grid h-9 w-9 place-items-center rounded-full text-sm ${tx.type === "receive" ? "bg-[#00ffa312] text-[#00ffa3]" : "bg-[#63caff12] text-[#63caff]"}`}>{tx.type === "receive" ? "↓" : "↑"}</span><span className="min-w-0 flex-1"><span className="block text-sm font-bold capitalize">{tx.type}</span><span className="block truncate text-[10px] font-mono text-[#5b7a99]">{tx.token} · block {tx.blockNumber}</span></span><span className="text-right"><span className="block text-xs font-mono text-white">{formatUnits(BigInt(tx.value), 6)}</span><span className="block text-[10px] text-[#5b7a99]">token units</span></span></a>)}</div>}
  </section>;
}

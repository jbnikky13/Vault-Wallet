"use client";

import { useEffect, useRef, useState } from "react";
import { useChainId, useSwitchChain } from "wagmi";
import { NETWORKS } from "@/lib/networks";

const STORAGE_KEY = "arc-wallet-enabled-networks";

export function NetworkSelector() {
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState<number[]>(NETWORKS.map((n) => n.id));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (Array.isArray(saved)) setEnabled(saved.filter((id) => NETWORKS.some((n) => n.id === id)));
    } catch {}
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const active = NETWORKS.find((network) => network.id === chainId) ?? NETWORKS[0];
  const visibleNetworks = NETWORKS.filter((network) => enabled.includes(network.id));

  const toggleNetwork = (id: number) => {
    const next = enabled.includes(id) ? enabled.filter((value) => value !== id) : [...enabled, id];
    if (next.length === 0) return;
    setEnabled(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex items-center gap-2 rounded-xl border border-[#ffffff15] bg-[#0c1020] px-4 py-2.5 text-sm font-bold hover:border-[#63caff55] transition-colors">
        <span className="h-2 w-2 rounded-full bg-[#00ffa3]" />
        {active.name}
        <span className="text-[#5b7a99]">⌄</span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-[#ffffff12] bg-[#0b1020] p-2 shadow-2xl">
          <div className="flex items-center justify-between px-3 py-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#5b7a99] font-mono">Enabled networks</p>
            <span className="text-[10px] font-mono text-[#5b7a99]">{visibleNetworks.length}/{NETWORKS.length}</span>
          </div>
          {NETWORKS.map((network) => {
            const selected = network.id === chainId;
            const isEnabled = enabled.includes(network.id);
            return (
              <div key={network.id} className={`flex w-full items-center gap-2 rounded-xl px-2 py-1 transition-colors ${selected ? "bg-[#63caff12]" : "hover:bg-[#ffffff08]"}`}>
                <button type="button" disabled={isPending || !isEnabled} onClick={() => { switchChain({ chainId: network.id }); setOpen(false); }} className="flex min-w-0 flex-1 items-center gap-3 px-1 py-2 text-left">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${selected ? "bg-[#00ffa3]" : "bg-[#ffffff20]"}`} />
                  <span className="min-w-0"><span className="block truncate text-sm font-bold">{network.name}</span><span className="block text-[11px] font-mono text-[#5b7a99]">Chain {network.id} · {network.symbol}</span></span>
                </button>
                <button type="button" aria-label={`${isEnabled ? "Disable" : "Enable"} ${network.name}`} onClick={() => toggleNetwork(network.id)} className={`h-5 w-9 rounded-full p-0.5 transition-colors ${isEnabled ? "bg-[#63caff]" : "bg-[#ffffff15]"}`}>
                  <span className={`block h-4 w-4 rounded-full bg-white transition-transform ${isEnabled ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </div>
            );
          })}
          <p className="px-3 py-2 text-[10px] leading-relaxed text-[#5b7a99]">Only switch to networks you trust. Assets remain separate by chain; use an established bridge for cross-chain transfers.</p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useChainId, useSwitchChain } from "wagmi";
import { NETWORKS } from "@/lib/networks";

export function NetworkSelector() {
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();
  const [open, setOpen] = useState(false);

  const active = NETWORKS.find((network) => network.id === chainId) ?? NETWORKS[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-xl border border-[#ffffff15] bg-[#0c1020] px-4 py-2.5 text-sm font-bold hover:border-[#63caff55] transition-colors"
      >
        <span className="h-2 w-2 rounded-full bg-[#00ffa3]" />
        {active.name}
        <span className="text-[#5b7a99]">⌄</span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-72 rounded-2xl border border-[#ffffff12] bg-[#0b1020] p-2 shadow-2xl">
          <p className="px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-[#5b7a99] font-mono">
            Networks
          </p>
          {NETWORKS.map((network) => {
            const selected = network.id === chainId;
            return (
              <button
                key={network.id}
                type="button"
                disabled={isPending}
                onClick={() => {
                  switchChain({ chainId: network.id });
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition-colors ${selected ? "bg-[#63caff12]" : "hover:bg-[#ffffff08]"}`}
              >
                <span>
                  <span className="block text-sm font-bold">{network.name}</span>
                  <span className="block text-[11px] font-mono text-[#5b7a99]">
                    Chain {network.id} · {network.symbol}
                  </span>
                </span>
                {selected && <span className="text-[#00ffa3]">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

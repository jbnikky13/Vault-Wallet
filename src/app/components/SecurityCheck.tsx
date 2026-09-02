"use client";

import { useEffect, useState } from "react";
import { isAddress } from "viem";

export function SecurityCheck({ address }: { address: string }) {
  const [state, setState] = useState<{risk:string;reason:string} | null>(null);
  useEffect(() => {
    if (!isAddress(address)) { setState(null); return; }
    const controller = new AbortController();
    fetch(`/api/security/address?address=${address}`, { signal: controller.signal }).then(r => r.json()).then(setState).catch(() => {});
    return () => controller.abort();
  }, [address]);
  if (!state) return null;
  return <div className={`rounded-xl border p-3 text-xs ${state.risk === "malicious" ? "border-[#ff4d6d66] bg-[#ff4d6d10] text-[#ff4d6d]" : "border-[#f5c84233] bg-[#f5c84208] text-[#f5c842]"}`}><strong>{state.risk === "malicious" ? "⚠ High risk address" : "⚠ Verify recipient"}</strong><p className="mt-1 opacity-80">{state.reason}. ARC Wallet will never claim an address is safe without a configured threat-intelligence provider.</p></div>;
}

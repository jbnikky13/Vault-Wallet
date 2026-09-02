"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount, useBalance, useChainId, useSendTransaction, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { formatUnits, isAddress, parseUnits } from "viem";
import { NETWORKS } from "@/lib/networks";
import { SecurityCheck } from "./SecurityCheck";

const erc20Abi = [{ name: "transfer", type: "function", stateMutability: "nonpayable", inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ type: "bool" }] }] as const;
type Token = { address: `0x${string}`; symbol: string; decimals: number };

export function SendReceive() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const active = useMemo(() => NETWORKS.find((n) => n.id === chainId) ?? NETWORKS[0], [chainId]);
  const native = useBalance({ address, chainId });
  const { sendTransaction, data: nativeHash, isPending: nativePending, error: nativeError } = useSendTransaction();
  const { writeContract, data: tokenHash, isPending: tokenPending, error: tokenError } = useWriteContract();
  const hash = nativeHash ?? tokenHash;
  const receipt = useWaitForTransactionReceipt({ hash, query: { enabled: Boolean(hash) } });
  const [tab, setTab] = useState<"send" | "receive">("send");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState<"native" | Token>("native");
  const [savedTokens, setSavedTokens] = useState<Token[]>([]);
  const [message, setMessage] = useState("");
  const [review, setReview] = useState(false);
  const [simulation, setSimulation] = useState<{ status: string; risk: string; message?: string; gasUsed?: string | null } | null>(null);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => { if (address) { try { setSavedTokens(JSON.parse(localStorage.getItem(`arc-wallet-tokens-${chainId}`) || "[]")); } catch { setSavedTokens([]); } } }, [address, chainId]);
  useEffect(() => {
    if (!hash || !address) return;
    try { const key = `arc-wallet-submitted-${address.toLowerCase()}`; const existing = JSON.parse(localStorage.getItem(key) || "[]"); const entry = { hash, chainId, type: token === "native" ? "native" : "token", asset: token === "native" ? active.symbol : token.symbol, recipient, amount, createdAt: new Date().toISOString() }; localStorage.setItem(key, JSON.stringify([entry, ...existing.filter((x: any) => x.hash !== hash)].slice(0, 100))); } catch {}
  }, [hash, address, chainId, token, recipient, amount, active.symbol]);

  const validate = () => {
    if (!address) return "Connect your wallet first.";
    if (!isAddress(recipient)) return "Enter a valid recipient address.";
    if (!amount || !Number.isFinite(Number(amount)) || Number(amount) <= 0) return "Enter a valid amount.";
    return "";
  };

  const runSimulation = async () => {
    const error = validate(); if (error) return setMessage(error);
    setMessage(""); setSimulation(null); setSimulating(true);
    try {
      const decimals = token === "native" ? active.decimals : token.decimals;
      const value = token === "native" ? `0x${parseUnits(amount, decimals).toString(16)}` : "0x0";
      const data = token === "native" ? "0x" : `0xa9059cbb${recipient.slice(2).padStart(64, "0")}${parseUnits(amount, decimals).toString(16).padStart(64, "0")}`;
      const response = await fetch("/api/security/simulate", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ chainId, from: address, to: token === "native" ? recipient : token.address, value, data }) });
      const result = await response.json();
      setSimulation(result);
      if (result.status === "blocked") setMessage(result.message || "Transaction simulation blocked this transaction.");
      else setReview(true);
    } catch (e) { setMessage(e instanceof Error ? e.message : "Unable to run transaction simulation"); }
    finally { setSimulating(false); }
  };

  const submit = () => {
    const error = validate(); if (error) return setMessage(error);
    if (simulation?.status === "blocked") return setMessage(simulation.message || "Transaction blocked by security checks.");
    setMessage(""); setReview(false);
    try {
      if (token === "native") sendTransaction({ to: recipient as `0x${string}`, value: parseUnits(amount, active.decimals) });
      else writeContract({ address: token.address, abi: erc20Abi, functionName: "transfer", args: [recipient as `0x${string}`, parseUnits(amount, token.decimals)] });
    } catch (e) { setMessage(e instanceof Error ? e.message : "Transaction failed"); }
  };
  const copyAddress = async () => { if (address) { await navigator.clipboard.writeText(address); setMessage("Address copied."); } };
  const busy = nativePending || tokenPending;
  if (!isConnected) return null;

  return <section className="mb-8 rounded-2xl border border-[#ffffff10] bg-[#0c1020] p-6">
    <div className="flex gap-2 mb-6"><button onClick={() => setTab("send")} className={`rounded-xl px-5 py-2 text-sm font-bold ${tab === "send" ? "bg-[#63caff] text-[#060810]" : "bg-[#111827] text-white"}`}>Send</button><button onClick={() => setTab("receive")} className={`rounded-xl px-5 py-2 text-sm font-bold ${tab === "receive" ? "bg-[#00ffa3] text-[#060810]" : "bg-[#111827] text-white"}`}>Receive</button><span className="ml-auto rounded-full border border-[#ffffff10] px-3 py-2 text-[10px] font-mono text-[#5b7a99]">{active.name}</span></div>
    {tab === "send" ? <div className="max-w-xl space-y-4">
      <div><label className="mb-1 block text-xs font-mono text-[#5b7a99]">Asset</label><select value={token === "native" ? "native" : token.address} onChange={(e) => { setSimulation(null); setToken(e.target.value === "native" ? "native" : savedTokens.find((t) => t.address === e.target.value) || "native"); }} className="w-full rounded-xl border border-[#ffffff12] bg-[#111827] px-3 py-3 text-sm outline-none"><option value="native">{active.symbol} (native)</option>{savedTokens.map((t) => <option key={t.address} value={t.address}>{t.symbol}</option>)}</select></div>
      <div><label className="mb-1 block text-xs font-mono text-[#5b7a99]">Recipient</label><input value={recipient} onChange={(e) => { setRecipient(e.target.value); setSimulation(null); }} placeholder="0x..." className="w-full rounded-xl border border-[#ffffff12] bg-[#111827] px-3 py-3 text-sm font-mono outline-none"/></div>
      {isAddress(recipient) && <SecurityCheck address={recipient} />}
      <div><label className="mb-1 block text-xs font-mono text-[#5b7a99]">Amount</label><input value={amount} onChange={(e) => { setAmount(e.target.value); setSimulation(null); }} inputMode="decimal" placeholder="0.00" className="w-full rounded-xl border border-[#ffffff12] bg-[#111827] px-3 py-3 text-sm font-mono outline-none"/><p className="mt-1 text-[11px] text-[#5b7a99]">Native balance: {native.data ? formatUnits(native.data.value, native.data.decimals) : "…"} {active.symbol}</p></div>
      {simulation && <div className={`rounded-xl border p-4 ${simulation.status === "blocked" ? "border-[#ff4d6d44] bg-[#ff4d6d08]" : simulation.status === "simulated" ? "border-[#00ffa344] bg-[#00ffa308]" : "border-[#f5c84244] bg-[#f5c84208]"}`}><p className="text-xs font-mono uppercase tracking-widest">Simulation: {simulation.status}</p><p className="mt-2 text-xs text-[#b5c7d9]">{simulation.message || (simulation.status === "simulated" ? "No simulation error was reported. Review the asset changes and recipient before signing." : "Simulation is unavailable for this network; review carefully before signing.")}</p>{simulation.gasUsed && <p className="mt-2 text-[10px] font-mono text-[#5b7a99]">Estimated gas used: {BigInt(simulation.gasUsed).toString()}</p>}</div>}
      {!review ? <button onClick={runSimulation} disabled={simulating} className="w-full rounded-xl bg-[#63caff] py-3 font-black text-[#060810] disabled:opacity-50">{simulating ? "Simulating…" : "Review & Simulate"}</button> : <div className="rounded-xl border border-[#f5c84233] bg-[#f5c84208] p-4"><p className="text-xs font-mono uppercase tracking-widest text-[#f5c842]">Confirm carefully</p><div className="mt-3 space-y-2 text-sm"><p>Network: <b>{active.name}</b></p><p>Asset: <b>{token === "native" ? active.symbol : token.symbol}</b></p><p>Amount: <b>{amount}</b></p><p className="break-all">Recipient: <b>{recipient}</b></p></div><p className="mt-3 text-xs text-[#f5c842]">Simulation is a point-in-time estimate. Blockchain transactions are irreversible. Verify the complete address before signing.</p><div className="mt-4 flex gap-2"><button onClick={() => setReview(false)} className="flex-1 rounded-xl border border-[#ffffff12] py-3 text-sm font-bold">Cancel</button><button onClick={submit} disabled={busy} className="flex-1 rounded-xl bg-[#63caff] py-3 font-black text-[#060810] disabled:opacity-50">{busy ? "Waiting…" : "Confirm & Send"}</button></div></div>}
      {(message || nativeError || tokenError) && <p className="text-xs text-[#ff4d6d] font-mono">{message || nativeError?.message || tokenError?.message}</p>}
      {hash && <p className={`text-xs font-mono ${receipt.isError ? "text-[#ff4d6d]" : receipt.isSuccess ? "text-[#00ffa3]" : "text-[#f5c842]"}`}>{receipt.isSuccess ? "Confirmed" : receipt.isError ? "Failed" : "Submitted · confirming…"} · <a className="underline" target="_blank" rel="noreferrer" href={`${active.explorerUrl}/tx/${hash}`}>{hash.slice(0, 12)}…</a></p>}
    </div> : <div className="max-w-xl rounded-2xl border border-[#00ffa322] bg-[#060810] p-6"><p className="text-xs font-mono uppercase tracking-widest text-[#5b7a99]">Receive on {active.name}</p><p className="mt-4 break-all text-lg font-black font-mono">{address}</p><button onClick={copyAddress} className="mt-5 rounded-xl bg-[#00ffa3] px-5 py-2.5 text-sm font-bold text-[#060810]">Copy address</button><p className="mt-4 text-xs leading-relaxed text-[#5b7a99]">Only send assets compatible with this network. Sending to the wrong network or unsupported token can result in permanent loss.</p>{message && <p className="mt-2 text-xs text-[#00ffa3] font-mono">{message}</p>}</div>}
  </section>;
}

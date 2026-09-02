"use client";

import { useState } from "react";
import Link from "next/link";
import { createPhraseOptions, getWalletAddress, type WalletPhraseOption } from "@/lib/wallet-creation";
import { saveWalletVault } from "@/lib/wallet-vault";

export default function CreateWalletPage() {
  const [options, setOptions] = useState<WalletPhraseOption[]>(() => createPhraseOptions());
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [showPhrase, setShowPhrase] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(false);

  const selectedOption = options.find((option) => option.id === selected) ?? null;
  const address = selectedOption ? getWalletAddress(selectedOption.mnemonic) : null;

  function regenerate() {
    setOptions(createPhraseOptions()); setSelected(null); setConfirmed(false); setShowPhrase(false); setError("");
  }

  async function createWallet() {
    if (!selectedOption || !address || !confirmed) return;
    if (password.length < 8) return setError("Use a wallet password with at least 8 characters.");
    if (password !== passwordAgain) return setError("Passwords do not match.");
    setBusy(true); setError("");
    try {
      await saveWalletVault(selectedOption.mnemonic, address, password);
      setCreated(true);
      setPassword(""); setPasswordAgain(""); setShowPhrase(false);
    } catch (err) { setError(err instanceof Error ? err.message : "Could not create wallet."); }
    finally { setBusy(false); }
  }

  return (
    <main className="min-h-screen p-6 md:p-10 max-w-4xl mx-auto">
      <Link href="/" className="text-sm text-[#63caff]">← Back to Arc Wallet</Link>
      <div className="mt-8 rounded-2xl border border-[#63caff33] bg-[#0c1020] p-6 md:p-8">
        <p className="text-xs font-mono tracking-widest text-[#63caff]">NEW WALLET</p>
        <h1 className="mt-2 text-3xl font-black">Create your Arc Wallet</h1>
        <p className="mt-2 text-sm text-[#8aa0b8]">Choose one of three securely generated recovery phrases. Your recovery phrase is encrypted locally and is never sent to Arc.</p>
        {created ? (
          <div className="mt-8 rounded-xl border border-[#00ffa355] bg-[#07140f] p-6">
            <p className="text-xs font-mono text-[#00ffa3]">WALLET CREATED</p>
            <h2 className="mt-2 text-2xl font-black">Your wallet is ready.</h2>
            <p className="mt-2 text-sm text-[#8aa0b8]">Your encrypted wallet vault is stored locally on this device. Keep your recovery phrase somewhere safe offline.</p>
            <div className="mt-5 rounded-xl bg-[#0c241b] p-4"><p className="text-xs text-[#5b7a99]">WALLET ADDRESS</p><p className="mt-1 break-all font-mono text-sm text-[#63caff]">{address}</p></div>
            <Link href="/wallet" className="mt-6 inline-block rounded-xl bg-[#63caff] px-6 py-3 text-sm font-black text-[#060810]">Open Wallet</Link>
          </div>
        ) : !selectedOption ? (
          <>
            <div className="grid gap-4 md:grid-cols-3 mt-8">
              {options.map((option, index) => <button key={option.id} onClick={() => setSelected(option.id)} className="text-left rounded-xl border border-[#ffffff15] bg-[#060810] p-5 hover:border-[#63caff88] transition-all"><div className="flex items-center justify-between mb-4"><span className="text-xs font-mono text-[#5b7a99]">OPTION {String.fromCharCode(65 + index)}</span><span className="text-[#00ffa3]">✓</span></div><div className="grid grid-cols-2 gap-2">{option.words.map((word, i) => <span key={`${word}-${i}`} className="rounded-lg bg-[#111827] px-2 py-2 text-xs font-mono">{i + 1}. {word}</span>)}</div><p className="mt-4 text-xs font-bold text-[#63caff]">Choose this phrase →</p></button>)}
            </div>
            <button onClick={regenerate} className="mt-5 rounded-xl border border-[#ffffff15] px-5 py-3 text-sm font-bold">Generate new options</button>
          </>
        ) : (
          <div className="mt-8">
            <div className="rounded-xl border border-[#00ffa333] bg-[#07140f] p-5"><p className="text-xs font-mono text-[#00ffa3]">RECOVERY PHRASE</p><div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">{selectedOption.words.map((word, i) => <span key={`${word}-${i}`} className="rounded-lg bg-[#0c241b] px-3 py-2 text-xs font-mono">{i + 1}. {showPhrase ? word : "••••••"}</span>)}</div><button onClick={() => setShowPhrase((v) => !v)} className="mt-4 text-xs text-[#63caff]">{showPhrase ? "Hide phrase" : "Reveal phrase"}</button></div>
            <label className="mt-6 flex gap-3 items-start rounded-xl border border-[#ffffff15] bg-[#060810] p-4 cursor-pointer"><input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-1" /><span className="text-sm">I have written down my recovery phrase and understand that anyone who has it can control this wallet.</span></label>
            {confirmed && <div className="mt-6 grid gap-4 md:grid-cols-2"><label className="text-sm"><span className="mb-2 block text-[#8aa0b8]">Wallet password</span><input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" className="w-full rounded-xl border border-[#ffffff15] bg-[#060810] px-4 py-3 outline-none focus:border-[#63caff]" /></label><label className="text-sm"><span className="mb-2 block text-[#8aa0b8]">Confirm password</span><input type="password" autoComplete="new-password" value={passwordAgain} onChange={(e) => setPasswordAgain(e.target.value)} placeholder="Repeat password" className="w-full rounded-xl border border-[#ffffff15] bg-[#060810] px-4 py-3 outline-none focus:border-[#63caff]" /></label></div>}
            {error && <p className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
            <div className="mt-6 flex gap-3 flex-wrap"><button disabled={!confirmed || busy} onClick={createWallet} className="rounded-xl bg-[#63caff] px-6 py-3 text-sm font-black text-[#060810] disabled:opacity-40">{busy ? "Encrypting wallet…" : "Create Wallet"}</button><button onClick={regenerate} className="rounded-xl border border-[#ffffff15] px-6 py-3 text-sm font-bold">Choose another</button></div>
            <p className="mt-5 text-xs leading-5 text-[#5b7a99]">Security: the recovery phrase is encrypted with AES-GCM using a key derived from your password. Arc does not receive or store your password, seed phrase, or private key.</p>
          </div>
        )}
      </div>
    </main>
  );
}

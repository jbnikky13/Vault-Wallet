"use client";

import { useState } from "react";
import Link from "next/link";
import { createPhraseOptions, getWalletAddress, type WalletPhraseOption } from "@/lib/wallet-creation";

export default function CreateWalletPage() {
  const [options, setOptions] = useState<WalletPhraseOption[]>(() => createPhraseOptions());
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [showPhrase, setShowPhrase] = useState(false);

  const selectedOption = options.find((option) => option.id === selected) ?? null;
  const address = selectedOption ? getWalletAddress(selectedOption.mnemonic) : null;

  function regenerate() {
    setOptions(createPhraseOptions());
    setSelected(null);
    setConfirmed(false);
    setShowPhrase(false);
  }

  return (
    <main className="min-h-screen p-6 md:p-10 max-w-4xl mx-auto">
      <Link href="/" className="text-sm text-[#63caff]">← Back to Arc Wallet</Link>

      <div className="mt-8 rounded-2xl border border-[#63caff33] bg-[#0c1020] p-6 md:p-8">
        <p className="text-xs font-mono tracking-widest text-[#63caff]">NEW WALLET</p>
        <h1 className="mt-2 text-3xl font-black">Choose your recovery phrase</h1>
        <p className="mt-2 text-sm text-[#8aa0b8]">
          Arc generates secure, random recovery phrases locally on your device. Choose one you prefer. Never share it with anyone.
        </p>

        {!selectedOption ? (
          <>
            <div className="grid gap-4 md:grid-cols-3 mt-8">
              {options.map((option, index) => (
                <button key={option.id} onClick={() => setSelected(option.id)} className="text-left rounded-xl border border-[#ffffff15] bg-[#060810] p-5 hover:border-[#63caff88] transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-[#5b7a99]">OPTION {String.fromCharCode(65 + index)}</span>
                    <span className="text-[#00ffa3]">✓</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {option.words.map((word, wordIndex) => <span key={`${word}-${wordIndex}`} className="rounded-lg bg-[#111827] px-2 py-2 text-xs font-mono">{wordIndex + 1}. {word}</span>)}
                  </div>
                  <p className="mt-4 text-xs font-bold text-[#63caff]">Choose this phrase →</p>
                </button>
              ))}
            </div>
            <button onClick={regenerate} className="mt-5 rounded-xl border border-[#ffffff15] px-5 py-3 text-sm font-bold">Generate new options</button>
          </>
        ) : (
          <div className="mt-8">
            <div className="rounded-xl border border-[#00ffa333] bg-[#07140f] p-5">
              <p className="text-xs font-mono text-[#00ffa3]">SELECTED RECOVERY PHRASE</p>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
                {selectedOption.words.map((word, index) => <span key={`${word}-${index}`} className="rounded-lg bg-[#0c241b] px-3 py-2 text-xs font-mono">{index + 1}. {showPhrase ? word : "••••••"}</span>)}
              </div>
              <button onClick={() => setShowPhrase((value) => !value)} className="mt-4 text-xs text-[#63caff]">{showPhrase ? "Hide phrase" : "Reveal phrase"}</button>
            </div>

            <label className="mt-6 flex gap-3 items-start rounded-xl border border-[#ffffff15] bg-[#060810] p-4 cursor-pointer">
              <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} className="mt-1" />
              <span className="text-sm">I have written down my recovery phrase and understand that anyone who has it can control this wallet.</span>
            </label>

            {confirmed && address && (
              <div className="mt-5 rounded-xl border border-[#ffffff15] p-4">
                <p className="text-xs text-[#5b7a99]">WALLET ADDRESS</p>
                <p className="mt-1 break-all font-mono text-sm text-[#63caff]">{address}</p>
              </div>
            )}

            <div className="mt-6 flex gap-3 flex-wrap">
              <button disabled={!confirmed} className="rounded-xl bg-[#63caff] px-6 py-3 text-sm font-black text-[#060810] disabled:opacity-40">Create Wallet</button>
              <button onClick={regenerate} className="rounded-xl border border-[#ffffff15] px-6 py-3 text-sm font-bold">Choose another</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

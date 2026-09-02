"use client";

import Link from "next/link";
import { ARC_TESTNET } from "@/lib/arc";

const cards = [
  ["🤖", "Agent Wallets", "User-controlled wallets with programmable spending policies.", "/agent", "Open Agent"],
  ["◎", "Gateway", "Unify USDC liquidity and prepare it for cross-chain and agentic flows.", "#gateway", "View Gateway"],
  ["⚡", "Nanopayments", "Gas-free USDC payments from $0.000001 through batched settlement.", "#nanopayments", "Explore Payments"],
  ["↗", "CCTP", "Move native USDC between supported chains and consolidate it on Arc.", "#crosschain", "View Bridge Rail"],
  ["⛽", "Paymaster", "Prepare gas-sponsored transaction experiences for supported Arc flows.", "#paymaster", "View Paymaster"],
  ["▣", "USYC", "Tokenized Treasury infrastructure available on Arc Testnet.", "#usyc", "View USYC"],
];

export default function ArcStackPage() {
  return (
    <main className="min-h-screen p-6 md:p-10 max-w-6xl mx-auto">
      <header className="mb-10">
        <Link href="/" className="text-sm text-[#63caff] font-mono">← Back to wallet</Link>
        <div className="mt-6 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#5b7a99] font-mono">Circle Agent Stack · Arc</p>
            <h1 className="text-4xl md:text-5xl font-black mt-2">ARC <span className="text-[#63caff]">Stack</span></h1>
            <p className="text-[#8aa4bd] max-w-2xl mt-3">A single control surface for agent wallets, unified USDC liquidity, nanopayments, cross-chain movement and programmable transaction flows.</p>
          </div>
          <div className="rounded-xl border border-[#63caff33] bg-[#0c1020] px-4 py-3 font-mono text-xs">
            <div className="text-[#5b7a99]">NETWORK</div>
            <div className="text-white mt-1">Arc Testnet · {ARC_TESTNET.chainId}</div>
          </div>
        </div>
      </header>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(([icon, title, description, href, label]) => (
          <a key={title} href={href} className="bg-[#0c1020] border border-[#ffffff10] rounded-2xl p-5 hover:border-[#63caff55] hover:bg-[#0d1728] transition-all">
            <div className="text-2xl mb-4">{icon}</div>
            <h2 className="font-bold text-lg">{title}</h2>
            <p className="text-sm text-[#6e89a3] mt-2 leading-relaxed">{description}</p>
            <span className="inline-block mt-5 text-xs font-mono text-[#63caff]">{label} →</span>
          </a>
        ))}
      </section>

      <section id="gateway" className="mt-8 bg-[#0c1020] border border-[#ffffff10] rounded-2xl p-6">
        <h2 className="text-xl font-bold">Gateway</h2>
        <p className="text-sm text-[#8aa4bd] mt-2 max-w-3xl">Gateway can provide unified USDC balances across supported chains. Arc Testnet is Gateway domain 26 and supports nanopayments.</p>
        <div className="grid sm:grid-cols-2 gap-3 mt-5 font-mono text-xs">
          <div className="bg-[#060810] rounded-lg p-3"><span className="text-[#5b7a99]">GatewayWallet</span><div className="text-white mt-1 break-all">{ARC_TESTNET.gatewayWallet}</div></div>
          <div className="bg-[#060810] rounded-lg p-3"><span className="text-[#5b7a99]">Testnet API</span><div className="text-white mt-1 break-all">{ARC_TESTNET.gatewayApiUrl}</div></div>
        </div>
      </section>

      <section id="nanopayments" className="mt-4 bg-[#0c1020] border border-[#ffffff10] rounded-2xl p-6">
        <h2 className="text-xl font-bold">Nanopayments</h2>
        <p className="text-sm text-[#8aa4bd] mt-2">Designed for AI agents and high-frequency services: buyers sign payment authorizations offchain, while Gateway batches settlement. Minimum documented payment size is $0.000001 USDC.</p>
        <div className="mt-4 inline-flex rounded-lg bg-[#00ffa315] border border-[#00ffa333] px-3 py-2 text-xs font-mono text-[#00ffa3]">GAS-FREE · BATCHED · x402</div>
      </section>

      <section id="crosschain" className="mt-4 bg-[#0c1020] border border-[#ffffff10] rounded-2xl p-6">
        <h2 className="text-xl font-bold">Cross-chain USDC</h2>
        <p className="text-sm text-[#8aa4bd] mt-2">CCTP provides the canonical cross-chain USDC rail. The wallet keeps the Arc-side configuration centralized so a future Bridge Kit flow can be added without changing the app architecture.</p>
        <div className="mt-4 text-xs font-mono text-[#63caff]">CCTP domain: {ARC_TESTNET.cctpDomain}</div>
      </section>

      <section id="paymaster" className="mt-4 bg-[#0c1020] border border-[#ffffff10] rounded-2xl p-6">
        <h2 className="text-xl font-bold">Paymaster</h2>
        <p className="text-sm text-[#8aa4bd] mt-2">Arc Testnet has a Circle Paymaster contract available for sponsored transaction flows. Keep sponsorship policy and eligibility checks in the application layer before submitting transactions.</p>
        <div className="mt-4 text-xs font-mono break-all text-[#f5c842]">{ARC_TESTNET.paymaster}</div>
      </section>

      <section id="usyc" className="mt-4 bg-[#0c1020] border border-[#ffffff10] rounded-2xl p-6">
        <h2 className="text-xl font-bold">USYC</h2>
        <p className="text-sm text-[#8aa4bd] mt-2">USYC infrastructure is available on Arc Testnet. The wallet surfaces it as a preview so tokenized Treasury functionality can be integrated without pretending that a user has a balance before a real account and contract interaction exist.</p>
      </section>

      <footer className="mt-10 text-xs text-[#5b7a99] font-mono">Arc Testnet configuration is centralized in src/lib/arc.ts. Never place Circle API keys, entity secrets or private keys in client-side code.</footer>
    </main>
  );
}

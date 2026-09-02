"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Link from "next/link";
import { NetworkSelector } from "./components/NetworkSelector";
import { WalletOverview } from "./components/WalletOverview";
import { NetworkPortfolio } from "./components/NetworkPortfolio";

const features = [
  { name: "Wallet", path: "/wallet", icon: "◈", desc: "Send · Receive · Tokens · Transaction history", badge: "CORE", color: "#63caff" },
  { name: "Swap", path: "/swap", icon: "⇅", desc: "Swap supported tokens across networks", badge: "UTILITY", color: "#63caff" },
  { name: "Security", path: "/create-wallet", icon: "🔐", desc: "Create and protect your self-custody wallet", badge: "SELF-CUSTODY", color: "#00ffa3" },
];

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  return (
    <main className="min-h-screen p-6 md:p-10 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-start mb-8 gap-5">
        <div>
          <h1 className="text-4xl font-black tracking-tight">ARC <span className="text-[#63caff]">Wallet</span></h1>
          <p className="text-[#5b7a99] text-sm mt-1 font-mono">Standalone self-custody wallet · multiple EVM networks</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap"><Link href="/create-wallet" className="bg-[#00ffa3] text-[#060810] font-bold px-5 py-2.5 rounded-xl text-sm">Create Wallet</Link><NetworkSelector /><ConnectButton /></div>
      </div>

      <div className="bg-gradient-to-br from-[#0d1f35] to-[#0a1525] border border-[#63caff33] rounded-2xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#63caff08] rounded-full -translate-y-16 translate-x-16" />
        <p className="text-[#5b7a99] text-xs font-mono uppercase tracking-widest mb-2">{isConnected ? `Connected · ${address?.slice(0,6)}...${address?.slice(-4)}` : "Create or connect a wallet to start"}</p>
        <p className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white to-[#63caff] bg-clip-text text-transparent">Your Multichain Wallet</p>
        <p className="text-[#00ffa3] text-sm mt-2 font-mono">Self-custody · send · receive · tokens · transaction history</p>
        <div className="flex gap-3 mt-6 flex-wrap"><Link href="/create-wallet" className="bg-[#63caff] text-[#060810] font-bold px-6 py-2.5 rounded-xl text-sm">Create New Wallet</Link><Link href="/wallet" className="bg-[#111827] border border-[#ffffff15] text-white font-bold px-6 py-2.5 rounded-xl text-sm">Open Wallet</Link><Link href="/swap" className="border border-[#63caff55] text-[#63caff] font-bold px-6 py-2.5 rounded-xl text-sm">Swap</Link></div>
      </div>

      <WalletOverview />
      <NetworkPortfolio />

      <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold">Wallet Features</h2><span className="text-xs font-mono text-[#5b7a99]">SELF-CUSTODY</span></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f) => <Link href={f.path} key={f.name}><div className="bg-[#0c1020] border border-[#ffffff10] hover:border-[#63caff44] rounded-xl p-5 cursor-pointer transition-all hover:bg-[#0d1f35] group h-full"><div className="flex justify-between items-start mb-3"><span className="text-2xl">{f.icon}</span><span className="text-xs font-mono px-2 py-1 rounded-full" style={{ background: `${f.color}18`, color: f.color }}>{f.badge}</span></div><h2 className="font-bold text-base group-hover:text-[#63caff] transition-colors mb-1">{f.name}</h2><p className="text-[#5b7a99] text-sm">{f.desc}</p></div></Link>)}
      </div>
    </main>
  );
}

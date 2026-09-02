"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NetworkSelector } from "../components/NetworkSelector";
import { WalletOverview } from "../components/WalletOverview";
import { PortfolioSummary } from "../components/PortfolioSummary";
import { TokenAssets } from "../components/TokenAssets";
import { SendReceive } from "../components/SendReceive";
import { TransactionHistory } from "../components/TransactionHistory";

export default function WalletPage() {
  return <main className="min-h-screen p-6 md:p-10 max-w-5xl mx-auto"><header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><Link href="/" className="text-xs font-mono text-[#5b7a99] hover:text-white">← Dashboard</Link><h1 className="mt-2 text-3xl font-black">Wallet <span className="text-[#63caff]">Assets</span></h1><p className="mt-1 text-sm font-mono text-[#5b7a99]">Active wallet · multichain portfolio · protected transactions</p></div><div className="flex flex-wrap gap-3 items-center"><NetworkSelector /><ConnectButton /></div></header><WalletOverview /><PortfolioSummary /><SendReceive /><TokenAssets /><TransactionHistory /></main>;
}

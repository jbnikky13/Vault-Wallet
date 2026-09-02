import { NextRequest, NextResponse } from "next/server";
import { NETWORKS } from "@/lib/networks";

const CIRCLE = "https://api.circle.com/v1/w3s";
const CHAIN_CODES: Record<number, string> = { 5042002: "ARC-TESTNET", 1: "ETH", 8453: "BASE", 137: "MATIC", 42161: "ARB", 10: "OP", 43114: "AVAX" };

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");
  const chainId = Number(req.nextUrl.searchParams.get("chainId"));
  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) return NextResponse.json({ error: "Valid EVM address is required" }, { status: 400 });
  if (!NETWORKS.some((n) => n.id === chainId)) return NextResponse.json({ error: "Unsupported network" }, { status: 400 });
  const apiKey = process.env.CIRCLE_API_KEY;
  if (!apiKey) return NextResponse.json({ configured: false, tokens: [], transactions: [], message: "Set CIRCLE_API_KEY to enable Circle indexed balances and transaction history." });
  const blockchain = CHAIN_CODES[chainId];
  if (!blockchain) return NextResponse.json({ configured: false, tokens: [], transactions: [], message: "Circle indexing is not configured for this network." });
  try {
    const headers = { Authorization: `Bearer ${apiKey}` };
    const [balanceRes, txRes] = await Promise.all([
      fetch(`${CIRCLE}/wallets/${blockchain}/${address}/balances`, { headers, cache: "no-store" }),
      fetch(`${CIRCLE}/transactions?blockchain=${blockchain}&destinationAddress=${address}&includeAll=true`, { headers, cache: "no-store" }),
    ]);
    const balances = await balanceRes.json();
    const txs = await txRes.json();
    if (!balanceRes.ok) return NextResponse.json({ configured: true, error: balances?.message || "Circle balance request failed" }, { status: balanceRes.status });
    return NextResponse.json({ configured: true, tokens: balances?.data?.tokenBalances ?? [], transactions: txs?.data?.transactions ?? [] });
  } catch (error) { return NextResponse.json({ configured: true, error: error instanceof Error ? error.message : "Circle request failed" }, { status: 502 }); }
}

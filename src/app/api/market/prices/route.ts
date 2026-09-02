import { NextRequest, NextResponse } from "next/server";
import { NETWORKS } from "@/lib/networks";

const PLATFORMS: Record<number, string> = {
  1: "ethereum",
  8453: "base",
  137: "polygon-pos",
  42161: "arbitrum-one",
  10: "optimistic-ethereum",
  56: "binance-smart-chain",
  43114: "avalanche",
};

export async function POST(req: NextRequest) {
  try {
    const { chainId, addresses = [] } = await req.json();
    if (!NETWORKS.some((n) => n.id === Number(chainId))) return NextResponse.json({ error: "Unsupported network" }, { status: 400 });
    const platform = PLATFORMS[Number(chainId)];
    if (!platform) return NextResponse.json({ prices: {}, supported: false });
    const normalized = [...new Set(addresses.filter((a: unknown) => typeof a === "string" && /^0x[a-fA-F0-9]{40}$/.test(a)).map((a: string) => a.toLowerCase()))].slice(0, 50);
    if (!normalized.length) return NextResponse.json({ prices: {}, supported: true });
    const params = new URLSearchParams({ contract_addresses: normalized.join(","), vs_currencies: "usd", include_24hr_change: "true" });
    const headers: Record<string, string> = { accept: "application/json" };
    if (process.env.COINGECKO_API_KEY) headers["x-cg-demo-api-key"] = process.env.COINGECKO_API_KEY;
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/token_price/${platform}?${params.toString()}`, { headers, next: { revalidate: 30 } });
    const json = await response.json();
    if (!response.ok) return NextResponse.json({ error: json?.error || "Price provider unavailable" }, { status: response.status });
    return NextResponse.json({ prices: json, supported: true, provider: "coingecko" });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Price lookup failed" }, { status: 500 }); }
}

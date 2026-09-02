import { NextRequest, NextResponse } from "next/server";

const PLATFORM: Record<string, string> = {
  "1": "ethereum",
  "8453": "base",
  "137": "polygon-pos",
  "42161": "arbitrum-one",
  "10": "optimistic-ethereum",
  "56": "binance-smart-chain",
  "43114": "avalanche",
};

export async function GET(req: NextRequest) {
  const chainId = req.nextUrl.searchParams.get("chainId") || "1";
  const addresses = (req.nextUrl.searchParams.get("addresses") || "").split(",").map((x) => x.trim().toLowerCase()).filter(Boolean).slice(0, 50);
  const platform = PLATFORM[chainId];
  if (!platform || !addresses.length) return NextResponse.json({ prices: {}, unsupported: true });
  const apiKey = process.env.COINGECKO_API_KEY;
  const base = apiKey ? "https://pro-api.coingecko.com/api/v3" : "https://api.coingecko.com/api/v3";
  const url = `${base}/simple/token_price/${platform}?contract_addresses=${encodeURIComponent(addresses.join(","))}&vs_currencies=usd&include_24hr_change=true`;
  try {
    const response = await fetch(url, { headers: apiKey ? { "x-cg-pro-api-key": apiKey } : {}, next: { revalidate: 30 } });
    if (!response.ok) throw new Error(`CoinGecko returned ${response.status}`);
    return NextResponse.json({ prices: await response.json(), source: "coingecko" });
  } catch (error) {
    return NextResponse.json({ prices: {}, error: error instanceof Error ? error.message : "Price lookup failed" }, { status: 502 });
  }
}

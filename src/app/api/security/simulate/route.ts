import { NextRequest, NextResponse } from "next/server";

const ALCHEMY_NETWORKS: Record<number, string> = {
  1: "eth-mainnet",
  137: "polygon-mainnet",
  42161: "arb-mainnet",
  10: "opt-mainnet",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const chainId = Number(body.chainId);
    const { from, to, value = "0x0", data = "0x" } = body;
    if (!/^0x[a-fA-F0-9]{40}$/.test(from || "") || !/^0x[a-fA-F0-9]{40}$/.test(to || "")) return NextResponse.json({ status: "blocked", risk: "high", message: "Invalid transaction address." }, { status: 400 });
    if (from.toLowerCase() === to.toLowerCase()) return NextResponse.json({ status: "blocked", risk: "high", message: "Recipient is the sending wallet." });
    if (to.toLowerCase() === "0x0000000000000000000000000000000000000000") return NextResponse.json({ status: "blocked", risk: "critical", message: "Zero address cannot be used as a recipient." });

    const apiKey = process.env.ALCHEMY_API_KEY;
    const network = ALCHEMY_NETWORKS[chainId];
    if (!apiKey || !network) return NextResponse.json({ status: "unknown", risk: "unknown", message: "Simulation unavailable for this network. Review the transaction carefully before signing." });

    const rpc = `https://${network}.g.alchemy.com/v2/${apiKey}`;
    const response = await fetch(rpc, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "alchemy_simulateAssetChanges", params: [{ from, to, value, data }] }), cache: "no-store" });
    const json = await response.json();
    if (!response.ok || json.error) return NextResponse.json({ status: "blocked", risk: "high", message: json?.error?.message || "Simulation failed. Do not sign until the transaction is reviewed." }, { status: 422 });
    const result = json.result || {};
    return NextResponse.json({ status: result.error ? "blocked" : "simulated", risk: result.error ? "high" : "review", error: result.error || null, gasUsed: result.gasUsed || null, changes: result.changes || [] });
  } catch (error) { return NextResponse.json({ status: "unknown", risk: "unknown", message: error instanceof Error ? error.message : "Simulation failed" }, { status: 500 }); }
}

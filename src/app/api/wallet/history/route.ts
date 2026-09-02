import { NextRequest, NextResponse } from "next/server";
import { NETWORKS } from "@/lib/networks";

const TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a7e8a1f7c";

function topicAddress(address: string) {
  return `0x${address.slice(2).toLowerCase().padStart(64, "0")}`;
}

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address")?.toLowerCase();
  const chainId = Number(req.nextUrl.searchParams.get("chainId"));
  const network = NETWORKS.find((item) => item.id === chainId);

  if (!address || !/^0x[a-f0-9]{40}$/.test(address) || !network) {
    return NextResponse.json({ error: "Valid address and supported chainId are required" }, { status: 400 });
  }

  try {
    const rpc = network.rpcUrl;
    const rpcCall = async (method: string, params: unknown[]) => {
      const response = await fetch(rpc, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: Date.now(), method, params }),
        cache: "no-store",
      });
      const json = await response.json();
      if (json.error) throw new Error(json.error.message || "RPC request failed");
      return json.result;
    };

    const latestHex = await rpcCall("eth_blockNumber", []);
    const latest = BigInt(latestHex);
    const from = latest > 5000n ? latest - 5000n : 0n;
    const padded = topicAddress(address);
    const [incoming, outgoing] = await Promise.all([
      rpcCall("eth_getLogs", [{ fromBlock: `0x${from.toString(16)}`, toBlock: `0x${latest.toString(16)}`, topics: [TRANSFER_TOPIC, null, padded] }]),
      rpcCall("eth_getLogs", [{ fromBlock: `0x${from.toString(16)}`, toBlock: `0x${latest.toString(16)}`, topics: [TRANSFER_TOPIC, padded, null] }]),
    ]);

    const logs = [...(incoming ?? []), ...(outgoing ?? [])]
      .sort((a: any, b: any) => Number(BigInt(b.blockNumber) - BigInt(a.blockNumber)))
      .slice(0, 50)
      .map((log: any) => ({
        hash: log.transactionHash,
        blockNumber: Number(BigInt(log.blockNumber)),
        token: log.address,
        from: `0x${log.topics[1].slice(-40)}`,
        to: `0x${log.topics[2].slice(-40)}`,
        value: BigInt(log.data).toString(),
        type: log.topics[2].slice(-40).toLowerCase() === address ? "receive" : "send",
        explorerUrl: `${network.explorerUrl}/tx/${log.transactionHash}`,
      }));

    return NextResponse.json({ chainId, network: network.name, latestBlock: latest.toString(), transfers: logs });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "History lookup failed" }, { status: 502 });
  }
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount, useBalance, useChainId, useReadContracts } from "wagmi";
import { formatUnits, isAddress } from "viem";
import { NETWORKS } from "@/lib/networks";

const erc20Abi = [
  { name: "balanceOf", type: "function", stateMutability: "view", inputs: [{ name: "account", type: "address" }], outputs: [{ type: "uint256" }] },
  { name: "decimals", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
  { name: "symbol", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { name: "name", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
] as const;

type Token = { address: `0x${string}`; symbol: string; name: string; decimals: number };

export function TokenAssets() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const active = useMemo(() => NETWORKS.find((n) => n.id === chainId) ?? NETWORKS[0], [chainId]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokenAddress, setTokenAddress] = useState("");
  const [error, setError] = useState("");
  const native = useBalance({ address, chainId });

  useEffect(() => {
    if (!address) return;
    try { setTokens(JSON.parse(localStorage.getItem(`arc-wallet-tokens-${chainId}`) || "[]")); } catch { setTokens([]); }
  }, [address, chainId]);

  const contracts = tokens.map((token) => ({
    address: token.address,
    abi: erc20Abi,
    functionName: "balanceOf" as const,
    args: [address!] as const,
  }));
  const balances = useReadContracts({ contracts, query: { enabled: Boolean(address && tokens.length) } });

  const addToken = async () => {
    setError("");
    if (!isAddress(tokenAddress)) return setError("Enter a valid ERC-20 token address.");
    if (tokens.some((t) => t.address.toLowerCase() === tokenAddress.toLowerCase())) return setError("Token already added.");
    const token = tokenAddress as `0x${string}`;
    try {
      const provider = (window as any).ethereum;
      if (!provider) throw new Error("Wallet provider not available");
      const call = async (data: string) => {
        const result = await provider.request({ method: "eth_call", params: [{ to: token, data }, "latest"] });
        return result;
      };
      const enc = (sig: string) => `0x${sig}`;
      const [nameHex, symbolHex, decimalsHex] = await Promise.all([call(enc("06fdde03")), call(enc("95d89b41")), call(enc("313ce567"))]);
      const decodeString = (hex: string) => {
        if (!hex || hex === "0x") return "Token";
        const bytes = hex.slice(2);
        try {
          const offset = parseInt(bytes.slice(0, 64), 16) * 2;
          const len = parseInt(bytes.slice(offset, offset + 64), 16) * 2;
          return new TextDecoder().decode(new Uint8Array((bytes.slice(offset + 64, offset + 64 + len).match(/.{2}/g) || []).map((x) => parseInt(x, 16)))).replace(/\0/g, "");
        } catch { return "Token"; }
      };
      const next = [...tokens, { address: token, name: decodeString(nameHex), symbol: decodeString(symbolHex), decimals: parseInt(decimalsHex, 16) }];
      setTokens(next);
      localStorage.setItem(`arc-wallet-tokens-${chainId}`, JSON.stringify(next));
      setTokenAddress("");
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to read token metadata"); }
  };

  if (!isConnected) return null;
  return (
    <section className="mb-8 rounded-2xl border border-[#ffffff10] bg-[#0c1020] p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="text-xl font-bold">Token assets</h2><p className="mt-1 text-xs text-[#5b7a99]">Native balance plus ERC-20 tokens you add for this network.</p></div>
        <span className="rounded-full border border-[#63caff33] px-2 py-1 text-[10px] font-mono text-[#63caff]">{active.name}</span>
      </div>
      <div className="grid gap-3">
        <div className="rounded-xl border border-[#63caff22] bg-[#060810] p-4 flex items-center justify-between"><div><p className="font-bold">{active.symbol}</p><p className="text-xs text-[#5b7a99]">Native asset</p></div><p className="font-black">{native.isLoading ? "…" : native.data?.formatted ?? "0"}</p></div>
        {tokens.map((token, i) => <div key={token.address} className="rounded-xl border border-[#ffffff10] bg-[#060810] p-4 flex items-center justify-between"><div><p className="font-bold">{token.symbol}</p><p className="text-xs text-[#5b7a99]">{token.name}</p></div><p className="font-black">{balances.data?.[i]?.result !== undefined ? formatUnits(balances.data[i].result as bigint, token.decimals) : "…"}</p></div>)}
      </div>
      <div className="mt-4 flex gap-2"><input value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} placeholder="Add ERC-20 token address" className="min-w-0 flex-1 rounded-xl border border-[#ffffff12] bg-[#111827] px-3 py-2 text-xs font-mono outline-none"/><button onClick={addToken} className="rounded-xl bg-[#63caff] px-4 py-2 text-xs font-bold text-[#060810]">Add token</button></div>
      {error && <p className="mt-2 text-xs text-[#ff4d6d] font-mono">{error}</p>}
    </section>
  );
}

import { NextRequest, NextResponse } from "next/server";

const KNOWN_SCAM_PATTERNS = [/^0x0{36,}$/i];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const recipient = String(body.recipient || "").toLowerCase();
    const amount = String(body.amount || "");
    const chainId = Number(body.chainId);
    const isAddress = /^0x[a-f0-9]{40}$/.test(recipient);
    const reasons: string[] = [];
    if (!isAddress) reasons.push("Recipient is not a valid EVM address.");
    if (KNOWN_SCAM_PATTERNS.some((p) => p.test(recipient))) reasons.push("Recipient matches a blocked address pattern.");
    if (!amount || Number(amount) <= 0) reasons.push("Amount must be greater than zero.");
    return NextResponse.json({ status: reasons.length ? "warning" : "unknown", chainId, recipient, reasons, note: "This is a local preflight check, not a guarantee of safety." });
  } catch {
    return NextResponse.json({ status: "unknown", reasons: ["Security preflight could not be completed."] }, { status: 400 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { isAddress, getAddress } from "viem";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address") || "";
  if (!isAddress(address)) return NextResponse.json({ risk: "unknown", reason: "Invalid address" }, { status: 400 });
  return NextResponse.json({ address: getAddress(address), risk: "unknown", reason: "No threat-intelligence provider configured", checks: ["checksum-valid", "format-valid"], requiresReview: true });
}

import { NextResponse } from "next/server";
import { NETWORKS } from "@/lib/networks";

export async function GET() {
  return NextResponse.json({ networks: NETWORKS });
}

import { NextResponse } from "next/server";
import { getAnalysisRequestCount } from "@/lib/analysisRequestCount";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const count = await getAnalysisRequestCount();
    return NextResponse.json({ count });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load analysis request count.", detail: String(err) },
      { status: 500 }
    );
  }
}


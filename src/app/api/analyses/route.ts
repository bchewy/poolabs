import { NextResponse } from "next/server";
import { getAnalysisResults } from "@/lib/database";

export async function GET(request: Request) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9);

  console.log(`📊 [${requestId}] Fetching analysis results from database`);

  try {
    const limit = new URL(request.url).searchParams.get('limit');
    const parsedLimit = limit ? parseInt(limit) : 50;

    const analyses = await getAnalysisResults(parsedLimit);

    const duration = Date.now() - startTime;
    console.log(`✅ [${requestId}] Successfully fetched ${analyses.length} analyses in ${duration}ms`);

    return NextResponse.json({
      ok: true,
      analyses,
      count: analyses.length,
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ [${requestId}] Failed to fetch analyses after ${duration}ms:`, error);

    return NextResponse.json(
      { error: "Failed to fetch analysis results" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { getAnalysisResults, filterAnalyses } from "@/lib/database";

export async function GET(request: Request) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9);

  console.log(`📊 [${requestId}] Fetching analysis results from database`);

  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    const filter = searchParams.get('filter');

    const parsedLimit = Math.min(limit ? parseInt(limit) : 10, 100); // Max 100 per page
    const parsedOffset = offset ? parseInt(offset) : 0;
    const shouldFilter = filter === 'true';

    const analyses = await getAnalysisResults(parsedLimit, parsedOffset);

    // Debug: Log first few entries to understand data structure
    if (shouldFilter) {
      console.log('🔍 DEBUG: First 3 entries before filtering:');
      analyses.slice(0, 3).forEach((analysis, i) => {
        console.log(`Entry ${i + 1}:`, {
          id: analysis.id,
          bristol_score: analysis.bristol_score,
          analysis: analysis.analysis ? analysis.analysis.substring(0, 100) + '...' : null,
          has_analysis: !!analysis.analysis,
          created_at: analysis.created_at
        });
      });
    }

    const filteredAnalyses = shouldFilter ? await filterAnalyses(analyses) : analyses;

    const duration = Date.now() - startTime;
    console.log(`✅ [${requestId}] Successfully fetched ${analyses.length} analyses, filtered to ${filteredAnalyses.length} in ${duration}ms`);

    return NextResponse.json({
      ok: true,
      analyses: filteredAnalyses,
      count: filteredAnalyses.length,
      offset: parsedOffset,
      limit: parsedLimit,
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
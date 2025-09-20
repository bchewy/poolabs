import { NextResponse } from "next/server";
import { getAnalysisResults, filterAnalyses, getAnalysisCount, StoredAnalysis } from "@/lib/database";

export async function GET(request: Request) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9);

  console.log(`📊 [${requestId}] Fetching analysis count from database`);

  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter');
    const shouldFilter = filter === 'true';

    if (shouldFilter) {
      // Get all analyses and filter them for accurate count
      // Fetch in batches to ensure we get all records
      let allAnalyses: StoredAnalysis[] = [];
      let offset = 0;
      const batchSize = 1000;

      while (true) {
        const batch = await getAnalysisResults(batchSize, offset);
        if (batch.length === 0) break;
        allAnalyses = allAnalyses.concat(batch);
        offset += batchSize;

        // Safety check to prevent infinite loop
        if (offset > 10000) break;
      }

      const filteredAnalyses = await filterAnalyses(allAnalyses);
      const count = filteredAnalyses.length;

      const duration = Date.now() - startTime;
      console.log(`✅ [${requestId}] Successfully fetched filtered count: ${count} in ${duration}ms`);

      return NextResponse.json({
        ok: true,
        count,
      });
    } else {
      const count = await getAnalysisCount();

      const duration = Date.now() - startTime;
      console.log(`✅ [${requestId}] Successfully fetched count: ${count} in ${duration}ms`);

      return NextResponse.json({
        ok: true,
        count,
      });
    }

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ [${requestId}] Failed to fetch count after ${duration}ms:`, error);

    return NextResponse.json(
      { error: "Failed to fetch analysis count" },
      { status: 500 }
    );
  }
}
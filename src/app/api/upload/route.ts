import { NextResponse } from "next/server";
import { analyzeStoolImage } from "@/lib/openai";

export async function POST(request: Request) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9);

  console.log(`📤 [${requestId}] Received image upload request`);
  console.log(`🔗 [${requestId}] User agent: ${request.headers.get('user-agent')?.substring(0, 100)}...`);
  console.log(`📍 [${requestId}] Origin: ${request.headers.get('origin') || 'unknown'}`);

  try {
    const form = await request.formData();
    const image = form.get("image");

    if (!(image instanceof File)) {
      console.log(`❌ [${requestId}] Invalid request: no image file provided`);
      return NextResponse.json(
        { error: "image is required as a form-data file field named 'image'" },
        { status: 400 }
      );
    }

    console.log(`📸 [${requestId}] Image details: ${image.name} (${image.type}, ${image.size} bytes)`);

    const arrayBuffer = await image.arrayBuffer();
    const size = arrayBuffer.byteLength;
    const imageBuffer = Buffer.from(arrayBuffer);

    const meta = {
      deviceId: form.get("deviceId")?.toString() || undefined,
      bristolScore: form.get("bristolScore")?.toString() || undefined,
      notes: form.get("notes")?.toString() || undefined,
    };

    console.log(`📋 [${requestId}] Form metadata:`);
    console.log(`   🔧 Device: ${meta.deviceId || 'not provided'}`);
    console.log(`   🎯 Bristol hint: ${meta.bistolScore || 'not provided'}`);
    console.log(`   📝 Notes: ${meta.notes || 'not provided'}`);

    // Perform AI analysis on the image
    console.log(`🤖 [${requestId}] Starting AI analysis...`);
    const analysisStart = Date.now();

    let aiAnalysis = null;
    try {
      aiAnalysis = await analyzeStoolImage({
        imageBuffer,
        mimeType: image.type,
        deviceId: meta.deviceId,
        notes: meta.notes,
      });

      const analysisDuration = Date.now() - analysisStart;
      console.log(`✅ [${requestId}] AI analysis completed in ${analysisDuration}ms`);

      if (aiAnalysis.analysis && !aiAnalysis.analysis.includes('fallback')) {
        console.log(`🎉 [${requestId}] Real OpenAI analysis successful!`);
      } else {
        console.log(`⚠️ [${requestId}] Using fallback analysis`);
      }

    } catch (error) {
      const analysisDuration = Date.now() - analysisStart;
      console.error(`❌ [${requestId}] OpenAI analysis failed after ${analysisDuration}ms:`, error);
      // Fallback analysis will be handled by the analyzeStoolImage function
    }

    const totalDuration = Date.now() - startTime;
    console.log(`⏱️ [${requestId}] Total request processed in ${totalDuration}ms`);
    console.log(`📊 [${requestId}] Final response summary:`);
    console.log(`   📁 File: ${image.name} (${Math.round(size / 1024)}KB)`);
    console.log(`   🔧 Device: ${meta.deviceId || 'unknown'}`);
    console.log(`   🤖 AI Analysis: ${aiAnalysis ? 'completed' : 'failed'}`);
    if (aiAnalysis) {
      console.log(`   🎯 Bristol: ${aiAnalysis.bristolScore || 'N/A'}`);
      console.log(`   💧 Hydration: ${aiAnalysis.hydrationIndex ? Math.round(aiAnalysis.hydrationIndex * 100) + '%' : 'N/A'}`);
      console.log(`   🎲 Confidence: ${aiAnalysis.confidence ? Math.round(aiAnalysis.confidence * 100) + '%' : 'N/A'}`);
    }

    // Note: We don't persist files on the server filesystem to keep the demo simple
    // and Vercel-compatible. Integrate a blob store (e.g., Vercel Blob, S3, Supabase)
    // if you need persistence.

    return NextResponse.json({
      ok: true,
      filename: image.name,
      mimeType: image.type,
      size,
      meta,
      aiAnalysis,
    });

  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error(`❌ [${requestId}] Request failed after ${totalDuration}ms:`, error);

    return NextResponse.json(
      { error: "Internal server error during upload" },
      { status: 500 }
    );
  }
}



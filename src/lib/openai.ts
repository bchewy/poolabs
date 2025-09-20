import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AnalysisInput {
  imageBuffer: Buffer;
  mimeType: string;
  deviceId?: string;
  notes?: string;
}

interface AnalysisResult {
  bristolScore?: number;
  color?: string;
  volumeEstimate?: "low" | "medium" | "high";
  hydrationIndex?: number;
  flags?: string[];
  confidence?: number;
  analysis?: string;
}

export async function analyzeStoolImage({
  imageBuffer,
  mimeType,
  deviceId,
  notes,
}: AnalysisInput): Promise<AnalysisResult> {
  const startTime = Date.now();
  const imageId = Math.random().toString(36).substr(2, 9);

  console.log(`🚀 [${imageId}] Starting OpenAI stool analysis...`);
  console.log(`📊 [${imageId}] Image details: ${Math.round(imageBuffer.length / 1024)}KB, ${mimeType}`);
  console.log(`🔧 [${imageId}] Device: ${deviceId || 'unknown'}`);
  console.log(`📝 [${imageId}] Notes: ${notes || 'none'}`);

  try {
    // Convert buffer to base64
    const base64Image = imageBuffer.toString("base64");
    const imageDataUrl = `data:${mimeType};base64,${base64Image}`;

    console.log(`🔄 [${imageId}] Image converted to base64, sending to OpenAI...`);

    const prompt = `You are a medical AI assistant specializing in stool analysis for health monitoring. Analyze this toilet bowl image and provide detailed health insights.

Please analyze the stool and provide a JSON response with the following structure:
{
  "bristolScore": number (1-7, where 1=severe constipation, 7=diarrhea),
  "color": string (e.g., "brown", "light brown", "dark brown", "green", "yellow", "black", "red"),
  "volumeEstimate": "low" | "medium" | "high",
  "hydrationIndex": number (0-1, where 0=dehydrated, 1=well-hydrated),
  "flags": string[] (health concerns like ["constipation", "dehydration", "blood", "infection", "normal"]),
  "confidence": number (0-1, confidence in your analysis),
  "analysis": string (detailed explanation of findings)
}

Bristol Scale Reference:
1: Hard lumps like nuts (severe constipation)
2: Sausage-shaped but lumpy (constipation)
3: Like a sausage but with cracks on surface (optimal)
4: Like a sausage or snake, smooth and soft (optimal)
5: Soft blobs with clear-cut edges (borderline loose)
6: Mushy consistency with ragged edges (loose stool)
7: Liquid consistency with no solid pieces (diarrhea)

Color Analysis:
- Brown: Normal
- Light brown: Normal
- Dark brown: Normal
- Green: Could indicate rapid transit or diet
- Yellow: Could indicate fat malabsorption
- Black: Could indicate upper GI bleeding
- Red: Could indicate lower GI bleeding

Be conservative in your assessments and flag anything unusual for medical attention. If you cannot make a confident assessment, indicate low confidence.`;

    // Use OpenAI's Responses API with vision capabilities
    console.log(`🤖 [${imageId}] Calling OpenAI GPT-4o-mini API...`);
    const openaiStart = Date.now();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "image_url",
              image_url: {
                url: imageDataUrl,
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
    });

    const openaiDuration = Date.now() - openaiStart;
    console.log(`✅ [${imageId}] OpenAI API completed in ${openaiDuration}ms`);
    console.log(`💰 [${imageId}] Usage: ${response.usage?.prompt_tokens || 'unknown'} prompt tokens, ${response.usage?.completion_tokens || 'unknown'} completion tokens`);

    // Parse the response
    const responseText = response.choices[0]?.message?.content || '';
    console.log(`📥 [${imageId}] Raw response length: ${responseText.length} characters`);

    let analysisResult: AnalysisResult;

    try {
      console.log(`🔍 [${imageId}] Parsing JSON response...`);
      analysisResult = JSON.parse(responseText);
      console.log(`✅ [${imageId}] JSON parsed successfully`);
    } catch {
      console.log(`⚠️ [${imageId}] JSON parsing failed, attempting to extract JSON from text...`);
      console.log(`📄 [${imageId}] Response preview: ${responseText.substring(0, 200)}...`);

      // If JSON parsing fails, try to extract JSON from the text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        console.log(`🔧 [${imageId}] Found JSON pattern in response, extracting...`);
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        console.error(`❌ [${imageId}] Failed to extract JSON from OpenAI response`);
        throw new Error("Failed to parse OpenAI response as JSON");
      }
    }

    // Validate and normalize the response
    console.log(`🔧 [${imageId}] Validating and normalizing response...`);
    const validatedResult = {
      bristolScore: analysisResult.bristolScore &&
                   analysisResult.bristolScore >= 1 &&
                   analysisResult.bristolScore <= 7 ?
                   Math.round(analysisResult.bristolScore) : undefined,
      color: analysisResult.color?.toLowerCase() || undefined,
      volumeEstimate: ["low", "medium", "high"].includes(analysisResult.volumeEstimate || "") ?
                     analysisResult.volumeEstimate as "low" | "medium" | "high" : undefined,
      hydrationIndex: analysisResult.hydrationIndex !== undefined ?
                      Math.max(0, Math.min(1, analysisResult.hydrationIndex)) : undefined,
      flags: Array.isArray(analysisResult.flags) ? analysisResult.flags : [],
      confidence: analysisResult.confidence !== undefined ?
                 Math.max(0, Math.min(1, analysisResult.confidence)) : undefined,
      analysis: analysisResult.analysis || "Analysis completed but no detailed summary provided.",
    };

    console.log(`📊 [${imageId}] Final analysis result:`);
    console.log(`   🎯 Bristol Score: ${validatedResult.bristolScore || 'N/A'}`);
    console.log(`   🎨 Color: ${validatedResult.color || 'N/A'}`);
    console.log(`   📏 Volume: ${validatedResult.volumeEstimate || 'N/A'}`);
    console.log(`   💧 Hydration: ${validatedResult.hydrationIndex ? Math.round(validatedResult.hydrationIndex * 100) + '%' : 'N/A'}`);
    console.log(`   🚩 Flags: ${validatedResult.flags?.join(', ') || 'none'}`);
    console.log(`   🎲 Confidence: ${validatedResult.confidence ? Math.round(validatedResult.confidence * 100) + '%' : 'N/A'}`);

    const totalDuration = Date.now() - startTime;
    console.log(`⏱️ [${imageId}] Total analysis completed in ${totalDuration}ms`);

    return validatedResult;

  } catch (error) {
    console.error(`❌ [${imageId}] OpenAI analysis error:`, error);
    console.error(`🔍 [${imageId}] Error details:`, error.message);

    const totalDuration = Date.now() - startTime;
    console.log(`⏱️ [${imageId}] Analysis failed after ${totalDuration}ms, using fallback`);

    // Fallback to mock data if OpenAI fails
    const fallbackResult = {
      bristolScore: 3,
      color: "brown",
      volumeEstimate: "medium",
      hydrationIndex: 0.7,
      flags: ["normal"],
      confidence: 0.5,
      analysis: "AI analysis unavailable. Using fallback assessment.",
    };

    console.log(`🔄 [${imageId}] Fallback result provided:`, fallbackResult);
    return fallbackResult;
  }
}
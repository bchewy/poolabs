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

interface GutHealthInsights {
  digestionStatus: string;
  dietaryImplications: string;
  potentialIssues: string[];
  recommendations: string[];
  followUpActions: string[];
}

interface MedicalInterpretation {
  possibleConditions: string[];
  urgencyLevel: "low" | "medium" | "high";
  whenToConsultDoctor: string;
  redFlags: string[];
}

interface AnalysisResult {
  bristolScore?: number;
  color?: string;
  volumeEstimate?: "low" | "medium" | "high";
  hydrationIndex?: number;
  flags?: string[];
  confidence?: number;
  analysis?: string;
  gutHealthInsights?: GutHealthInsights;
  medicalInterpretation?: MedicalInterpretation;
}

export async function analyzeStoolImage({
  imageBuffer,
  mimeType,
  deviceId,
  notes,
}: AnalysisInput): Promise<AnalysisResult> {
  const startTime = Date.now();
  const imageId = Math.random().toString(36).substring(2, 11);

  console.log(`🚀 [${imageId}] Starting OpenAI stool analysis...`);
  console.log(`📊 [${imageId}] Image details: ${Math.round(imageBuffer.length / 1024)}KB, ${mimeType}`);
  console.log(`🔧 [${imageId}] Device: ${deviceId || 'unknown'}`);
  console.log(`📝 [${imageId}] Notes: ${notes || 'none'}`);

  try {
    // Convert buffer to base64
    const base64Image = imageBuffer.toString("base64");
    const imageDataUrl = `data:${mimeType};base64,${base64Image}`;

    console.log(`🔄 [${imageId}] Image converted to base64, sending to OpenAI...`);

    const systemPrompt = `You are a medical AI assistant specializing in comprehensive stool analysis for gut health monitoring. Analyze this toilet bowl image and provide detailed, actionable health insights.

Please analyze the stool and provide a JSON response with the following structure:
{
  "bristolScore": number (1-7, where 1=severe constipation, 7=diarrhea),
  "color": string (e.g., "brown", "light brown", "dark brown", "green", "yellow", "black", "red"),
  "volumeEstimate": "low" | "medium" | "high",
  "hydrationIndex": number (0-1, where 0=dehydrated, 1=well-hydrated),
  "flags": string[] (health concerns like ["constipation", "dehydration", "blood", "infection", "normal"]),
  "confidence": number (0-1, confidence in your analysis),
  "analysis": string (brief summary of key findings),
  "gutHealthInsights": {
    "digestionStatus": string (detailed assessment of digestive health),
    "dietaryImplications": string (what diet might be causing this),
    "potentialIssues": string[] (possible gut health concerns),
    "recommendations": string[] (actionable dietary and lifestyle changes),
    "followUpActions": string[] (specific steps to take and monitor)
  },
  "medicalInterpretation": {
    "possibleConditions": string[] (potential medical interpretations),
    "urgencyLevel": "low" | "medium" | "high",
    "whenToConsultDoctor": string (specific guidelines),
    "redFlags": string[] (symptoms that require immediate attention)
  }
}

Bristol Scale Reference:
1: Hard lumps like nuts (severe constipation) - indicates slow transit, possible dehydration
2: Sausage-shaped but lumpy (mild constipation) - needs more fiber and water
3: Like a sausage but with cracks on surface (optimal) - healthy digestion
4: Like a sausage or snake, smooth and soft (optimal) - excellent gut health
5: Soft blobs with clear-cut edges (borderline loose) - consider reducing irritants
6: Mushy consistency with ragged edges (loose stool) - may indicate infection or intolerance
7: Liquid consistency with no solid pieces (diarrhea) - requires hydration and possible medical attention

Color Analysis:
- Brown: Normal healthy stool
- Light brown: Normal, may indicate high fiber diet
- Dark brown: Normal, may indicate high iron or meat consumption
- Green: Rapid transit, diet high in greens, or possible bacterial imbalance
- Yellow: Fat malabsorption, celiac disease, or pancreatic issues
- Black: Upper GI bleeding, iron supplements, or certain medications
- Red: Lower GI bleeding, hemorrhoids, or certain foods (beets, cranberries)

Medical Context:
- Bristol 1-2: Constipation - IBS-C, hypothyroidism, medication side effects
- Bristol 3-4: Normal - healthy gut function
- Bristol 5-7: Diarrhea - IBS-D, infections, food intolerances, IBD
- Unusual colors: May indicate malabsorption, bleeding, or medical conditions

Actionable Insights:
- Dietary recommendations based on stool characteristics
- Hydration guidance
- When to seek medical attention
- Lifestyle modifications
- Gut health optimization strategies

Be thorough but conservative in your assessments. Provide specific, actionable advice while flagging anything unusual for potential medical attention.

${notes ? `Additional user notes: ${notes}` : ''}`;

    // Use OpenAI's Responses API with vision capabilities
    const modelName = "gpt-4o-mini"; // Faster model for quicker analysis
    console.log(`🤖 [${imageId}] Calling OpenAI Responses API with model: ${modelName}`);
    console.log(`📊 [${imageId}] Model details: gpt-4o-mini - Latest fast multimodal model`);
    const openaiStart = Date.now();

    const response = await openai.responses.create({
      model: modelName,
      input: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: [
            {
              type: "input_image",
              image_url: imageDataUrl,
              detail: "auto",
            },
            {
              type: "input_text",
              text: "Please analyze this stool image according to the medical guidelines provided.",
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_object",
        },
      },
    });

    const openaiDuration = Date.now() - openaiStart;
    console.log(`✅ [${imageId}] OpenAI API completed in ${openaiDuration}ms`);
    console.log(`🎯 [${imageId}] Model used: ${modelName}`);
    console.log(`💰 [${imageId}] Usage: ${response.usage?.input_tokens || 'unknown'} input tokens, ${response.usage?.output_tokens || 'unknown'} output tokens`);
    console.log(`⚡ [${imageId}] Performance: ${response.usage?.input_tokens && response.usage?.output_tokens ?
      Math.round((response.usage.input_tokens + response.usage.output_tokens) / (openaiDuration / 1000)) : 'unknown'} tokens/second`);

    // Parse the response
    const responseText = response.output_text || '';
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
      gutHealthInsights: analysisResult.gutHealthInsights ? {
        digestionStatus: analysisResult.gutHealthInsights.digestionStatus || "Unable to determine digestion status",
        dietaryImplications: analysisResult.gutHealthInsights.dietaryImplications || "No dietary implications identified",
        potentialIssues: Array.isArray(analysisResult.gutHealthInsights.potentialIssues) ? analysisResult.gutHealthInsights.potentialIssues : [],
        recommendations: Array.isArray(analysisResult.gutHealthInsights.recommendations) ? analysisResult.gutHealthInsights.recommendations : [],
        followUpActions: Array.isArray(analysisResult.gutHealthInsights.followUpActions) ? analysisResult.gutHealthInsights.followUpActions : [],
      } : undefined,
      medicalInterpretation: analysisResult.medicalInterpretation ? {
        possibleConditions: Array.isArray(analysisResult.medicalInterpretation.possibleConditions) ? analysisResult.medicalInterpretation.possibleConditions : [],
        urgencyLevel: ["low", "medium", "high"].includes(analysisResult.medicalInterpretation.urgencyLevel || "") ?
                        analysisResult.medicalInterpretation.urgencyLevel as "low" | "medium" | "high" : "low",
        whenToConsultDoctor: analysisResult.medicalInterpretation.whenToConsultDoctor || "No specific guidance provided",
        redFlags: Array.isArray(analysisResult.medicalInterpretation.redFlags) ? analysisResult.medicalInterpretation.redFlags : [],
      } : undefined,
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
    console.error(`🔍 [${imageId}] Error details:`, error instanceof Error ? error.message : 'Unknown error');

    const totalDuration = Date.now() - startTime;
    console.log(`⏱️ [${imageId}] Analysis failed after ${totalDuration}ms, using fallback`);

    // Fallback to mock data if OpenAI fails
    const fallbackResult: AnalysisResult = {
      bristolScore: 3,
      color: "brown",
      volumeEstimate: "medium",
      hydrationIndex: 0.7,
      flags: ["normal"],
      confidence: 0.5,
      analysis: "AI analysis unavailable. Using fallback assessment.",
    };

    console.log(`🔄 [${imageId}] Fallback result provided - no API call made`);
    console.log(`⚠️ [${imageId}] Using mock data due to API failure`);
    return fallbackResult;
  }
}
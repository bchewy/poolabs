import { supabase } from './supabase'

export interface GutHealthInsights {
  digestionStatus: string;
  dietaryImplications: string;
  potentialIssues: string[];
  recommendations: string[];
  followUpActions: string[];
}

export interface MedicalInterpretation {
  possibleConditions: string[];
  urgencyLevel: "low" | "medium" | "high";
  whenToConsultDoctor: string;
  redFlags: string[];
}

export interface AnalysisResult {
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

export interface StoredAnalysis {
  id: string
  filename: string
  mime_type: string
  size: number
  image_data: string
  device_id?: string
  notes?: string
  bristol_score?: number
  color?: string
  volume_estimate?: 'low' | 'medium' | 'high'
  hydration_index?: number
  flags?: string[]
  confidence?: number
  analysis?: string
  gut_health_insights?: GutHealthInsights
  medical_interpretation?: MedicalInterpretation
  created_at: string
}

// Helper function to normalize image data before storing
const normalizeImageDataForStorage = (imageData: string, mimeType: string): string => {
  // Check if the data already has a MIME type prefix
  if (imageData.startsWith('data:')) {
    return imageData;
  }

  // Remove any whitespace
  const cleanData = imageData.trim();

  return `data:${mimeType};base64,${cleanData}`;
};

export async function storeAnalysisResult(
  filename: string,
  mimeType: string,
  size: number,
  imageData: string,
  deviceId?: string,
  notes?: string,
  aiAnalysis?: AnalysisResult
): Promise<StoredAnalysis> {
  // Normalize image data before storing to ensure consistency
  const normalizedImageData = normalizeImageDataForStorage(imageData, mimeType);

  // First try to insert with all fields
  try {
    const { data, error } = await supabase
      .from('analysis_results')
      .insert([{
        filename,
        mime_type: mimeType,
        size,
        image_data: normalizedImageData,
        device_id: deviceId,
        notes,
        bristol_score: aiAnalysis?.bristolScore,
        color: aiAnalysis?.color,
        volume_estimate: aiAnalysis?.volumeEstimate,
        hydration_index: aiAnalysis?.hydrationIndex,
        flags: aiAnalysis?.flags,
        confidence: aiAnalysis?.confidence,
        analysis: aiAnalysis?.analysis,
        gut_health_insights: aiAnalysis?.gutHealthInsights,
        medical_interpretation: aiAnalysis?.medicalInterpretation,
      }])
      .select()
      .single()

    if (error) {
      throw error;
    }

    return data;
  } catch (error: unknown) {
    // If the error is about missing columns, try without the new fields
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('gut_health_insights') || errorMessage.includes('medical_interpretation')) {
      console.log('⚠️ New columns not found in database, storing basic analysis only...');

      const { data, error: fallbackError } = await supabase
        .from('analysis_results')
        .insert([{
          filename,
          mime_type: mimeType,
          size,
          image_data: normalizedImageData,
          device_id: deviceId,
          notes,
          bristol_score: aiAnalysis?.bristolScore,
          color: aiAnalysis?.color,
          volume_estimate: aiAnalysis?.volumeEstimate,
          hydration_index: aiAnalysis?.hydrationIndex,
          flags: aiAnalysis?.flags,
          confidence: aiAnalysis?.confidence,
          analysis: aiAnalysis?.analysis,
        }])
        .select()
        .single()

      if (fallbackError) {
        throw new Error(`Failed to store analysis result: ${fallbackError.message}`)
      }

      return data;
    } else {
      throw new Error(`Failed to store analysis result: ${errorMessage}`)
    }
  }
}

export async function getAnalysisResults(limit: number = 50, offset: number = 0): Promise<StoredAnalysis[]> {
  const { data, error } = await supabase
    .from('analysis_results')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    throw new Error(`Failed to fetch analysis results: ${error.message}`)
  }

  return data || []
}

export async function getAnalysisCount(): Promise<number> {
  const { count, error } = await supabase
    .from('analysis_results')
    .select('*', { count: 'exact', head: true })

  if (error) {
    throw new Error(`Failed to get analysis count: ${error.message}`)
  }

  return count || 0
}

// Quick function to detect if analysis text indicates actual stool analysis vs fallback/generic
export async function isActualStoolAnalysis(analysisText: string): Promise<boolean> {
  // Quick keyword check for common fallback patterns
  const fallbackPatterns = [
    'unable to analyze',
    'unclear image',
    'insufficient information',
    'lack of visual information',
    'cannot determine',
    'unable to determine',
    'image is unclear',
    'not sufficient',
    'fallback assessment',
    'ai analysis unavailable'
  ];

  const lowerText = analysisText.toLowerCase();

  // If it matches fallback patterns, it's not real stool analysis
  if (fallbackPatterns.some(pattern => lowerText.includes(pattern))) {
    return false;
  }

  // If it has stool-specific keywords, it's likely real analysis
  const stoolKeywords = [
    'bristol', 'stool', 'bowel', 'feces', 'consistency',
    'hydration', 'color', 'volume', 'texture', 'formation',
    'constipation', 'diarrhea', 'normal', 'healthy'
  ];

  return stoolKeywords.some(keyword => lowerText.includes(keyword));
}

// Filter function to exclude non-stool entries without meaningful analysis
export async function filterAnalyses(analyses: StoredAnalysis[]): Promise<StoredAnalysis[]> {
  console.log(`🔍 Filtering ${analyses.length} analyses...`);

  const filtered = [];

  for (const analysis of analyses) {
    const hasBristol = !!analysis.bristol_score;
    let hasMeaningfulAnalysis = false;

    // Check if there's analysis text
    if (analysis.analysis && analysis.analysis.trim() !== '') {
      hasMeaningfulAnalysis = await isActualStoolAnalysis(analysis.analysis);
    }

    const shouldKeep = hasBristol || hasMeaningfulAnalysis;

    console.log(`📋 Entry ${analysis.id}: bristol=${hasBristol}, meaningful_analysis=${hasMeaningfulAnalysis}, keep=${shouldKeep}`);

    if (shouldKeep) {
      filtered.push(analysis);
    }
  }

  console.log(`✅ Filtered from ${analyses.length} to ${filtered.length} entries`);
  return filtered;
}
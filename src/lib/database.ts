import { supabase } from './supabase'

export interface AnalysisResult {
  bristolScore?: number;
  color?: string;
  volumeEstimate?: "low" | "medium" | "high";
  hydrationIndex?: number;
  flags?: string[];
  confidence?: number;
  analysis?: string;
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
  created_at: string
}

export async function storeAnalysisResult(
  filename: string,
  mimeType: string,
  size: number,
  imageData: string,
  deviceId?: string,
  notes?: string,
  aiAnalysis?: AnalysisResult
): Promise<StoredAnalysis> {
  const { data, error } = await supabase
    .from('analysis_results')
    .insert([{
      filename,
      mime_type: mimeType,
      size,
      image_data: imageData,
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

  if (error) {
    throw new Error(`Failed to store analysis result: ${error.message}`)
  }

  return data
}

export async function getAnalysisResults(limit: number = 50): Promise<StoredAnalysis[]> {
  const { data, error } = await supabase
    .from('analysis_results')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(`Failed to fetch analysis results: ${error.message}`)
  }

  return data || []
}
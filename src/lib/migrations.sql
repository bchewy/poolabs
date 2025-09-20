-- Create table for storing stool analysis results
CREATE TABLE IF NOT EXISTS analysis_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  image_data TEXT NOT NULL,
  device_id TEXT,
  notes TEXT,
  bristol_score INTEGER CHECK (bristol_score >= 1 AND bristol_score <= 7),
  color TEXT,
  volume_estimate TEXT CHECK (volume_estimate IN ('low', 'medium', 'high')),
  hydration_index REAL CHECK (hydration_index >= 0 AND hydration_index <= 1),
  flags TEXT[],
  confidence REAL CHECK (confidence >= 0 AND confidence <= 1),
  analysis TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries by device
CREATE INDEX IF NOT EXISTS idx_analysis_results_device_id ON analysis_results(device_id);

-- Create index for faster queries by creation time
CREATE INDEX IF NOT EXISTS idx_analysis_results_created_at ON analysis_results(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (for the API)
CREATE POLICY "Allow anonymous inserts" ON analysis_results
  FOR INSERT WITH CHECK (true);

-- Create policy to allow anonymous selects (for the dashboard)
CREATE POLICY "Allow anonymous selects" ON analysis_results
  FOR SELECT USING (true);
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous inserts" ON analysis_results;
DROP POLICY IF EXISTS "Allow anonymous selects" ON analysis_results;

-- Add columns for enhanced analysis (if they don't exist)
ALTER TABLE analysis_results
ADD COLUMN IF NOT EXISTS gut_health_insights JSONB,
ADD COLUMN IF NOT EXISTS medical_interpretation JSONB;

-- Create policies with IF NOT EXISTS equivalent
CREATE POLICY "Allow anonymous inserts" ON analysis_results
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous selects" ON analysis_results
  FOR SELECT USING (true);
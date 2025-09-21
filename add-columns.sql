-- Run only the ALTER TABLE statements to add the missing columns
ALTER TABLE analysis_results
ADD COLUMN IF NOT EXISTS gut_health_insights JSONB,
ADD COLUMN IF NOT EXISTS medical_interpretation JSONB;
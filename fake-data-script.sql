-- Fake Data Script for Health Trends Testing
-- This script creates realistic sample data to demonstrate the health trends feature

-- Clear existing data (optional - comment out if you want to keep existing data)
-- DELETE FROM analysis_results;

-- Function to generate random dates within the last 90 days
CREATE OR REPLACE FUNCTION random_date_in_last_90_days()
RETURNS TIMESTAMP AS $$
BEGIN
  RETURN NOW() - (RANDOM() * 90 || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql;

-- Function to generate realistic random bristol scores (weighted toward normal values)
CREATE OR REPLACE FUNCTION random_bristol_score()
RETURNS INTEGER AS $$
DECLARE
  rand FLOAT := RANDOM();
BEGIN
  -- Weighted distribution: more likely to be normal (3-4)
  IF rand < 0.5 THEN RETURN 3 + FLOOR(RANDOM() * 2); -- 3-4 (50% chance)
  ELSIF rand < 0.7 THEN RETURN 2; -- 2 (20% chance)
  ELSIF rand < 0.85 THEN RETURN 5; -- 5 (15% chance)
  ELSIF rand < 0.9 THEN RETURN 1; -- 1 (10% chance)
  ELSIF rand < 0.95 THEN RETURN 6; -- 6 (5% chance)
  ELSE RETURN 7; -- 7 (5% chance)
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to generate random hydration index
CREATE OR REPLACE FUNCTION random_hydration_index()
RETURNS REAL AS $$
BEGIN
  -- Most values between 0.4 and 0.9 with some outliers
  RETURN 0.4 + (RANDOM() * 0.5) + (RANDOM() * 0.2 - 0.1);
END;
$$ LANGUAGE plpgsql;

-- Function to generate random volume estimate
CREATE OR REPLACE FUNCTION random_volume_estimate()
RETURNS TEXT AS $$
DECLARE
  rand FLOAT := RANDOM();
BEGIN
  IF rand < 0.6 THEN RETURN 'medium';
  ELSIF rand < 0.8 THEN RETURN 'low';
  ELSE RETURN 'high';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to generate flags based on bristol score
CREATE OR REPLACE FUNCTION generate_flags(score INTEGER, hydration REAL)
RETURNS TEXT[] AS $$
DECLARE
  flags TEXT[] := ARRAY[]::TEXT[];
BEGIN
  -- Constipation flags
  IF score <= 2 THEN
    flags := flags || ARRAY['constipation'];
    IF hydration < 0.5 THEN
      flags := flags || ARRAY['dehydration'];
    END IF;
  END IF;

  -- Diarrhea flags
  IF score >= 6 THEN
    flags := flags || ARRAY['diarrhea'];
    IF hydration > 0.8 THEN
      flags := flags || ARRAY['high_hydration'];
    END IF;
  END IF;

  -- Dehydration flag
  IF hydration < 0.4 THEN
    flags := flags || ARRAY['dehydration'];
  END IF;

  -- Perfect stool flag
  IF score = 4 AND hydration BETWEEN 0.6 AND 0.8 THEN
    flags := flags || ARRAY['optimal'];
  END IF;

  RETURN flags;
END;
$$ LANGUAGE plpgsql;

-- Function to generate random device ID
CREATE OR REPLACE FUNCTION random_device_id()
RETURNS TEXT AS $$
DECLARE
  devices TEXT[] := ARRAY['toilet-clip-01', 'microbit-controller-01', 'senior-monitor-02', 'bathroom-sensor-01'];
BEGIN
  RETURN devices[FLOOR(RANDOM() * ARRAY_LENGTH(devices, 1)) + 1];
END;
$$ LANGUAGE plpgsql;

-- Function to generate gut health insights
CREATE OR REPLACE FUNCTION generate_gut_health_insights(score INTEGER, hydration REAL)
RETURNS JSONB AS $$
DECLARE
  insights JSONB;
  status TEXT;
  diet TEXT;
  issues TEXT[];
  recommendations TEXT[];
  follow_up TEXT[];
BEGIN

  -- Determine digestion status
  IF score = 4 THEN
    status := 'Excellent digestion - optimal stool formation';
    diet := 'Current diet appears well-balanced for digestive health';
    recommendations := ARRAY['Maintain current fiber intake', 'Continue staying hydrated'];
    follow_up := ARRAY['Continue monitoring', 'No changes needed'];
  ELSIF score BETWEEN 3 AND 4 THEN
    status := 'Good digestion - healthy stool consistency';
    diet := 'Diet is supporting good digestive function';
    recommendations := ARRAY['Maintain current eating habits', 'Ensure adequate water intake'];
    follow_up := ARRAY['Regular monitoring recommended'];
  ELSIF score BETWEEN 2 AND 3 THEN
    status := 'Mild constipation - slightly hard stool';
    diet := 'Consider increasing fiber and water intake';
    issues := ARRAY['Mild constipation'];
    recommendations := ARRAY['Increase fiber intake', 'Drink more water', 'Consider adding prunes or other fiber-rich foods'];
    follow_up := ARRAY['Monitor for improvement', 'Consider dietary changes'];
  ELSIF score <= 2 THEN
    status := 'Significant constipation - hard, difficult to pass stool';
    diet := 'Low fiber intake suspected, increase fruits, vegetables, and whole grains';
    issues := ARRAY['Constipation', 'Possible dehydration'];
    recommendations := ARRAY['Significantly increase fiber intake', 'Drink at least 8 glasses of water daily', 'Consider fiber supplements', 'Add gentle exercise like walking'];
    follow_up := ARRAY['Consult doctor if persists', 'Monitor for worsening symptoms'];
  ELSIF score BETWEEN 5 AND 6 THEN
    status := 'Mild diarrhea - loose stool';
    diet := 'May have consumed irritants or have mild digestive upset';
    issues := ARRAY['Mild diarrhea'];
    recommendations := ARRAY['Eat bland foods like bananas, rice, toast', 'Stay hydrated with clear fluids', 'Avoid dairy temporarily', 'Monitor for triggers'];
    follow_up := ARRAY['Watch for improvement', 'Identify potential food triggers'];
  ELSE
    status := 'Significant diarrhea - very loose, watery stool';
    diet := 'Possible food poisoning, infection, or digestive irritant';
    issues := ARRAY['Diarrhea', 'Risk of dehydration'];
    recommendations := ARRAY['Focus on hydration with clear fluids', 'Eat BRAT diet (bananas, rice, applesauce, toast)', 'Avoid dairy, caffeine, and fatty foods', 'Rest and monitor closely'];
    follow_up := ARRAY['Seek medical attention if persists more than 2 days', 'Watch for signs of severe dehydration'];
  END IF;

  -- Add hydration-specific recommendations
  IF hydration < 0.5 THEN
    recommendations := recommendations || ARRAY['Increase water intake significantly'];
    issues := ARRAY['Low hydration'] || issues;
  ELSIF hydration > 0.8 AND score >= 6 THEN
    recommendations := recommendations || ARRAY['Maintain good hydration levels'];
  END IF;

  insights := jsonb_build_object(
    'digestionStatus', status,
    'dietaryImplications', diet,
    'potentialIssues', issues,
    'recommendations', recommendations,
    'followUpActions', follow_up
  );

  RETURN insights;
END;
$$ LANGUAGE plpgsql;

-- Function to generate medical interpretation
CREATE OR REPLACE FUNCTION generate_medical_interpretation(score INTEGER, flags TEXT[])
RETURNS JSONB AS $$
DECLARE
  interpretation JSONB;
  urgency TEXT;
  when_to_see TEXT;
  conditions TEXT[];
  red_flags TEXT[];
BEGIN

  -- Determine urgency level
  IF score <= 1 OR score >= 7 THEN
    urgency := 'high';
    when_to_see := 'Consult a doctor within 24-48 hours if symptoms persist';
    red_flags := ARRAY['Severe digestive distress', 'Risk of dehydration'];
  ELSIF score <= 2 OR score >= 6 THEN
    urgency := 'medium';
    when_to_see := 'Monitor symptoms and consult doctor if they persist for more than 3-5 days';
    red_flags := ARRAY['Persistent abnormal symptoms'];
  ELSE
    urgency := 'low';
    when_to_see := 'No immediate medical attention needed, monitor for changes';
    red_flags := ARRAY[]::TEXT[];
  END IF;

  -- Determine possible conditions
  IF score <= 2 THEN
    conditions := ARRAY['Constipation', 'Dehydration', 'Possible bowel obstruction'];
    IF score = 1 THEN
      red_flags := red_flags || ARRAY['Severe constipation requiring immediate attention'];
    END IF;
  ELSIF score >= 6 THEN
    conditions := ARRAY['Diarrhea', 'Gastroenteritis', 'Food intolerance', 'Infection'];
    IF score = 7 THEN
      red_flags := red_flags || ARRAY['Severe diarrhea - risk of rapid dehydration'];
    END IF;
  ELSIF score = 4 THEN
    conditions := ARRAY['Normal bowel function'];
  ELSE
    conditions := ARRAY['Mild digestive irregularity'];
  END IF;

  -- Add specific red flags based on flags
  IF 'constipation' = ANY(flags) AND 'dehydration' = ANY(flags) THEN
    red_flags := red_flags || ARRAY['Combined constipation and dehydration risk'];
  END IF;

  interpretation := jsonb_build_object(
    'possibleConditions', conditions,
    'urgencyLevel', urgency,
    'whenToConsultDoctor', when_to_see,
    'redFlags', red_flags
  );

  RETURN interpretation;
END;
$$ LANGUAGE plpgsql;

-- Generate sample data - create entries for the last 60 days with varying frequency
DO $$
DECLARE
  i INTEGER;
  date_var TIMESTAMP;
  bristol_var INTEGER;
  hydration_var REAL;
  volume_var TEXT;
  flags_var TEXT[];
  insights_var JSONB;
  medical_var JSONB;
  device_var TEXT;
  entries_per_day INTEGER;
BEGIN

  -- Generate data for the last 60 days
  FOR i IN 0..59 LOOP
    date_var := NOW() - (i || ' days')::INTERVAL;

    -- Vary frequency: some days have 0, 1, 2, or 3 entries
    entries_per_day := CASE
      WHEN RANDOM() < 0.2 THEN 0 -- 20% chance of no entries
      WHEN RANDOM() < 0.6 THEN 1 -- 40% chance of 1 entry
      WHEN RANDOM() < 0.85 THEN 2 -- 25% chance of 2 entries
      ELSE 3 -- 15% chance of 3 entries
    END;

    -- Create entries for this day
    FOR j IN 1..entries_per_day LOOP
      bristol_var := random_bristol_score();
      hydration_var := random_hydration_index();
      volume_var := random_volume_estimate();
      flags_var := generate_flags(bristol_var, hydration_var);
      insights_var := generate_gut_health_insights(bristol_var, hydration_var);
      medical_var := generate_medical_interpretation(bristol_var, flags_var);
      device_var := random_device_id();

      INSERT INTO analysis_results (
        filename,
        mime_type,
        size,
        image_data,
        device_id,
        notes,
        bristol_score,
        color,
        volume_estimate,
        hydration_index,
        flags,
        confidence,
        analysis,
        gut_health_insights,
        medical_interpretation,
        created_at
      ) VALUES (
        'sample_' || i || '_' || j || '.jpg',
        'image/jpeg',
        FLOOR(RANDOM() * 2000000 + 500000), -- Random size between 500KB and 2.5MB
        'fake_image_data_for_testing',
        device_var,
        'Sample data entry for testing health trends',
        bristol_var,
        CASE
          WHEN bristol_var <= 2 THEN 'brown'
          WHEN bristol_var <= 4 THEN 'medium_brown'
          WHEN bristol_var <= 6 THEN 'light_brown'
          ELSE 'yellow_brown'
        END,
        volume_var,
        hydration_var,
        flags_var,
        0.7 + (RANDOM() * 0.25), -- Confidence between 70-95%
        CASE
          WHEN bristol_var <= 2 THEN 'Hard, difficult to pass stool indicating constipation'
          WHEN bristol_var = 3 THEN 'Well-formed but slightly hard stool'
          WHEN bristol_var = 4 THEN 'Ideal well-formed stool, healthy digestion'
          WHEN bristol_var = 5 THEN 'Soft blob with well-defined edges, mild loose stool'
          WHEN bristol_var = 6 THEN 'Fluffy pieces with ragged edges, mild diarrhea'
          ELSE 'Watery stool with no solid pieces, significant diarrhea'
        END,
        insights_var,
        medical_var,
        date_var - (RANDOM() * 86400 || ' seconds')::INTERVAL -- Random time during the day
      );
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Generated % sample entries for the last 60 days', (
    SELECT COUNT(*) FROM analysis_results WHERE created_at >= NOW() - '60 days'::INTERVAL
  );

END $$;

-- Create some specific patterns for better testing
-- Week with improving trend
DO $$
DECLARE
  i INTEGER;
BEGIN
  FOR i IN 0..5 LOOP -- Changed from 0..6 to 0..5 to keep bristol score within 1-7 range
    INSERT INTO analysis_results (
      filename, mime_type, size, image_data, device_id, notes,
      bristol_score, color, volume_estimate, hydration_index, flags, confidence, analysis,
      gut_health_insights, medical_interpretation, created_at
    ) VALUES (
      'improving_trend_' || i || '.jpg', 'image/jpeg', 1000000, 'fake_data', 'toilet-clip-01',
      'Improving trend sample',
      2 + i, -- Improving from 2 to 7 (within valid range)
      CASE WHEN 2 + i <= 4 THEN 'brown' ELSE 'medium_brown' END,
      'medium',
      0.4 + (i * 0.05), -- Improving hydration
      CASE WHEN 2 + i <= 2 THEN ARRAY['constipation']
           WHEN 2 + i >= 6 THEN ARRAY['diarrhea']
           ELSE ARRAY[]::TEXT[] END,
      0.8 + (i * 0.02),
      CASE WHEN 2 + i <= 2 THEN 'Hard stool, constipation'
           WHEN 2 + i = 4 THEN 'Perfect stool formation'
           ELSE 'Loose stool' END,
      generate_gut_health_insights(2 + i, 0.4 + (i * 0.05)),
      generate_medical_interpretation(2 + i, CASE WHEN 2 + i <= 2 THEN ARRAY['constipation']
                                                   WHEN 2 + i >= 6 THEN ARRAY['diarrhea']
                                                   ELSE ARRAY[]::TEXT[] END),
      NOW() - (25 + i || ' days')::INTERVAL
    );
  END LOOP;
END $$;

-- Week with concerning pattern (high bristol scores)
DO $$
DECLARE
  i INTEGER;
BEGIN
  FOR i IN 0..6 LOOP
    INSERT INTO analysis_results (
      filename, mime_type, size, image_data, device_id, notes,
      bristol_score, color, volume_estimate, hydration_index, flags, confidence, analysis,
      gut_health_insights, medical_interpretation, created_at
    ) VALUES (
      'concerning_pattern_' || i || '.jpg', 'image/jpeg', 1200000, 'fake_data', 'senior-monitor-02',
      'Concerning pattern sample',
      6 + FLOOR(RANDOM() * 1.0), -- Mostly 6-7 (changed from 1.5 to 1.0 to ensure valid range)
      'yellow_brown',
      'high',
      0.8 + (RANDOM() * 0.15),
      ARRAY['diarrhea'],
      0.85,
      'Watery stool, diarrhea pattern detected',
      generate_gut_health_insights(7, 0.85),
      generate_medical_interpretation(7, ARRAY['diarrhea']),
      NOW() - (10 + i || ' days')::INTERVAL
    );
  END LOOP;
END $$;

-- Add specific "super bad" days wi
th multiple concerning entries
-- Episode 1: Acute gastroenteritis (5 days ago)
DO $$
DECLARE
  i INTEGER;
BEGIN
  -- Create 4 entries on the same day showing severe digestive distress
  FOR i IN 0..3 LOOP
    INSERT INTO analysis_results (
      filename, mime_type, size, image_data, device_id, notes,
      bristol_score, color, volume_estimate, hydration_index, flags, confidence, analysis,
      gut_health_insights, medical_interpretation, created_at
    ) VALUES (
      'acute_episode_1_' || i || '.jpg', 'image/jpeg', 800000 + (i * 200000), 'fake_data', 'senior-monitor-02',
      'Acute gastroenteritis episode - day 1 of illness',
      7, -- Severe diarrhea
      'yellow_brown',
      CASE WHEN i = 0 THEN 'high' ELSE 'medium' END, -- Varying volumes
      0.85 + (RANDOM() * 0.1), -- High hydration (watery)
      ARRAY['diarrhea', 'dehydration_risk', 'acute_episode'],
      0.9,
      'Severe watery diarrhea - possible acute gastroenteritis',
      generate_gut_health_insights(7, 0.9),
      generate_medical_interpretation(7, ARRAY['diarrhea', 'dehydration_risk']),
      NOW() - ('5 days'::INTERVAL) - (i * 3 || ' hours')::INTERVAL -- Spread throughout the day
    );
  END LOOP;

  -- Next day: recovery beginning but still concerning
  FOR i IN 0..2 LOOP
    INSERT INTO analysis_results (
      filename, mime_type, size, image_data, device_id, notes,
      bristol_score, color, volume_estimate, hydration_index, flags, confidence, analysis,
      gut_health_insights, medical_interpretation, created_at
    ) VALUES (
      'acute_episode_2_' || i || '.jpg', 'image/jpeg', 900000, 'fake_data', 'senior-monitor-02',
      'Acute episode - day 2, recovery beginning',
      6, -- Still loose but improving
      'light_brown',
      'medium',
      0.75 + (RANDOM() * 0.1),
      ARRAY['diarrhea', 'recovering'],
      0.85,
      'Loose stool - improvement from yesterday''s acute episode',
      generate_gut_health_insights(6, 0.8),
      generate_medical_interpretation(6, ARRAY['diarrhea']),
      NOW() - ('4 days'::INTERVAL) - (i * 4 || ' hours')::INTERVAL
    );
  END LOOP;
END $$;

-- Episode 2: Severe constipation cluster (12 days ago)
DO $$
DECLARE
  i INTEGER;
BEGIN
  -- Create 3 entries over 2 days showing severe constipation
  FOR i IN 0..2 LOOP
    INSERT INTO analysis_results (
      filename, mime_type, size, image_data, device_id, notes,
      bristol_score, color, volume_estimate, hydration_index, flags, confidence, analysis,
      gut_health_insights, medical_interpretation, created_at
    ) VALUES (
      'constipation_episode_' || i || '.jpg', 'image/jpeg', 1500000, 'fake_data', 'toilet-clip-01',
      'Severe constipation episode - difficult elimination',
      1, -- Severe constipation
      'dark_brown',
      'low',
      0.3 + (RANDOM() * 0.1), -- Very low hydration
      ARRAY['constipation', 'severe_dehydration', 'abdominal_pain'],
      0.95,
      'Hard, dry, difficult to pass stool - signs of significant constipation',
      generate_gut_health_insights(1, 0.35),
      generate_medical_interpretation(1, ARRAY['constipation', 'severe_dehydration']),
      NOW() - ('12 days'::INTERVAL) - (i * 8 || ' hours')::INTERVAL
    );
  END LOOP;
END $$;

-- Episode 3: Alternating pattern (18 days ago) - could indicate IBS or infection
DO $$
DECLARE
  i INTEGER;
BEGIN
  -- Create alternating pattern over 3 days (diarrhea -> constipation -> diarrhea)
  FOR i IN 0..2 LOOP
    INSERT INTO analysis_results (
      filename, mime_type, size, image_data, device_id, notes,
      bristol_score, color, volume_estimate, hydration_index, flags, confidence, analysis,
      gut_health_insights, medical_interpretation, created_at
    ) VALUES (
      'alternating_episode_' || i || '.jpg', 'image/jpeg', 1000000, 'fake_data', 'microbit-controller-01',
      'Alternating pattern episode - day ' || (i + 1),
      CASE WHEN i = 1 THEN 2 ELSE 7 END, -- Day 1: 7, Day 2: 2, Day 3: 7
      CASE WHEN i = 1 THEN 'dark_brown' ELSE 'yellow_brown' END,
      CASE WHEN i = 1 THEN 'low' ELSE 'high' END,
      CASE WHEN i = 1 THEN 0.35 ELSE 0.85 END,
      CASE
        WHEN i = 1 THEN ARRAY['constipation', 'alternating_pattern']
        ELSE ARRAY['diarrhea', 'alternating_pattern']
      END,
      0.88,
      CASE
        WHEN i = 1 THEN 'Hard, difficult stool - unusual alternation'
        ELSE 'Watery stool - alternating pattern concerning'
      END,
      generate_gut_health_insights(CASE WHEN i = 1 THEN 2 ELSE 7 END, CASE WHEN i = 1 THEN 0.35 ELSE 0.85 END),
      generate_medical_interpretation(CASE WHEN i = 1 THEN 2 ELSE 7 END, CASE WHEN i = 1 THEN ARRAY['constipation'] ELSE ARRAY['diarrhea'] END),
      NOW() - ('18 days'::INTERVAL) - (i * 12 || ' hours')::INTERVAL
    );
  END LOOP;
END $$;

-- Episode 4: Multiple device alerts (25 days ago) - systemic issue affecting multiple users
DO $$
DECLARE
  device_id TEXT;
  i INTEGER;
BEGIN
  -- Create concerning entries from multiple devices on the same day
  FOR device_id IN VALUES ('toilet-clip-01', 'microbit-controller-01', 'senior-monitor-02') LOOP
    FOR i IN 0..1 LOOP
      INSERT INTO analysis_results (
        filename, mime_type, size, image_data, device_id, notes,
        bristol_score, color, volume_estimate, hydration_index, flags, confidence, analysis,
        gut_health_insights, medical_interpretation, created_at
      ) VALUES (
        'multi_device_' || REPLACE(device_id, '-', '_') || '_' || i || '.jpg',
        'image/jpeg', 1100000, 'fake_data', device_id,
        'Multi-device concerning pattern - possible systemic issue',
        CASE WHEN device_id = 'toilet-clip-01' THEN 1 ELSE 6 END, -- Mixed concerning patterns
        CASE WHEN device_id = 'toilet-clip-01' THEN 'dark_brown' ELSE 'yellow_brown' END,
        CASE WHEN device_id = 'toilet-clip-01' THEN 'low' ELSE 'high' END,
        CASE WHEN device_id = 'toilet-clip-01' THEN 0.3 ELSE 0.8 END,
        CASE
          WHEN device_id = 'toilet-clip-01' THEN ARRAY['constipation', 'multi_device_alert']
          ELSE ARRAY['diarrhea', 'multi_device_alert']
        END,
        0.87,
        CASE
          WHEN device_id = 'toilet-clip-01' THEN 'Severe constipation - multi-device alert'
          ELSE 'Diarrhea pattern - multi-device concern'
        END,
        generate_gut_health_insights(CASE WHEN device_id = 'toilet-clip-01' THEN 1 ELSE 6 END, CASE WHEN device_id = 'toilet-clip-01' THEN 0.3 ELSE 0.8 END),
        generate_medical_interpretation(CASE WHEN device_id = 'toilet-clip-01' THEN 1 ELSE 6 END, CASE WHEN device_id = 'toilet-clip-01' THEN ARRAY['constipation'] ELSE ARRAY['diarrhea'] END),
        NOW() - ('25 days'::INTERVAL) - (i * 6 || ' hours')::INTERVAL
      );
    END LOOP;
  END LOOP;
END $$;

-- Clean up temporary functions
DROP FUNCTION IF EXISTS random_date_in_last_90_days();
DROP FUNCTION IF EXISTS random_bristol_score();
DROP FUNCTION IF EXISTS random_hydration_index();
DROP FUNCTION IF EXISTS random_volume_estimate();
DROP FUNCTION IF EXISTS generate_flags(INTEGER, REAL);
DROP FUNCTION IF EXISTS random_device_id();
DROP FUNCTION IF EXISTS generate_gut_health_insights(INTEGER, REAL);
DROP FUNCTION IF EXISTS generate_medical_interpretation(INTEGER, TEXT[]);

-- Verify data creation
SELECT
  COUNT(*) as total_entries,
  COUNT(DISTINCT device_id) as unique_devices,
  MIN(created_at) as earliest_entry,
  MAX(created_at) as latest_entry,
  AVG(bristol_score) as avg_bristol_score,
  AVG(hydration_index) as avg_hydration_index
FROM analysis_results
WHERE created_at >= NOW() - '90 days'::INTERVAL;

-- Show sample of generated data
SELECT
  created_at::date as entry_date,
  device_id,
  bristol_score,
  hydration_index,
  volume_estimate,
  flags,
  confidence
FROM analysis_results
WHERE created_at >= NOW() - '90 days'::INTERVAL
ORDER BY created_at DESC
LIMIT 20;
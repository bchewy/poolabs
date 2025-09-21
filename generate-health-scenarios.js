#!/usr/bin/env node

/**
 * Health Scenario Data Generator
 * Creates realistic health scenarios using real images with multiple variations
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
require('dotenv').config({ path: '.env.local' });

// Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const IMAGE_DIR = path.join(__dirname, 'data');

// Health scenarios to simulate
const HEALTH_SCENARIOS = [
  {
    name: 'normal_week',
    description: 'Normal healthy bowel movements',
    duration: 7,
    entriesPerDay: [1, 2],
    bristolRange: [3, 5],
    hydrationRange: [0.6, 0.8],
    flags: []
  },
  {
    name: 'constipation_episode',
    description: 'Constipation episode',
    duration: 5,
    entriesPerDay: [0, 1],
    bristolRange: [1, 2],
    hydrationRange: [0.2, 0.4],
    flags: ['constipation', 'dehydration']
  },
  {
    name: 'diarrhea_episode',
    description: 'Diarrhea episode',
    duration: 4,
    entriesPerDay: [3, 6],
    bristolRange: [6, 7],
    hydrationRange: [0.8, 0.95],
    flags: ['diarrhea']
  },
  {
    name: 'recovery_phase',
    description: 'Recovery phase after illness',
    duration: 6,
    entriesPerDay: [1, 2],
    bristolRange: [3, 4],
    hydrationRange: [0.5, 0.7],
    flags: ['recovering']
  },
  {
    name: 'improving_trend',
    description: 'Improving digestive health trend',
    duration: 10,
    entriesPerDay: [1, 2],
    bristolRange: [2, 6], // Gradually improving
    hydrationRange: [0.4, 0.8],
    flags: []
  }
];

function getImageFiles() {
  const files = fs.readdirSync(IMAGE_DIR);
  return files.filter(file => file.match(/\.(jpg|jpeg|png)$/i));
}

function imageToBase64(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);
  return imageBuffer.toString('base64');
}

function getImageMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    default:
      return 'image/jpeg';
  }
}

function getRandomDeviceId() {
  const devices = ['toilet-clip-01', 'microbit-controller-01', 'senior-monitor-02', 'bathroom-sensor-01'];
  return devices[Math.floor(Math.random() * devices.length)];
}

function getRandomTimestamp(startDays, endDays = 0) {
  const start = new Date();
  start.setDate(start.getDate() - startDays);

  const end = new Date();
  end.setDate(end.getDate() - endDays);

  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTime);
}

async function analyzeImageWithScenario(imageBase64, mimeType, filename, scenario) {
  try {
    const prompt = `Analyze this toilet bowl image for digestive health assessment.

Context: This is part of a "${scenario.description}" scenario. Expected characteristics:
- Bristol score range: ${scenario.bristolRange[0]}-${scenario.bristolRange[1]}
- Hydration index range: ${scenario.hydrationRange[0]}-${scenario.hydrationRange[1]}
- Typical flags: ${scenario.flags.join(', ')}

Return a JSON response with this structure:
{
  "bristol_score": number (${scenario.bristolRange[0]}-${scenario.bristolRange[1]}),
  "color": string,
  "volume_estimate": string ("low", "medium", "high"),
  "hydration_index": number (${scenario.hydrationRange[0]}-${scenario.hydrationRange[1]}),
  "flags": string[],
  "confidence": number (0.5-1.0),
  "analysis": string,
  "gut_health_insights": {
    "digestionStatus": string,
    "dietaryImplications": string,
    "potentialIssues": string[],
    "recommendations": string[],
    "followUpActions": string[]
  },
  "medical_interpretation": {
    "possibleConditions": string[],
    "urgencyLevel": string ("low", "medium", "high"),
    "whenToConsultDoctor": string,
    "redFlags": string[]
  }
}

Be medically accurate and reflect the scenario context.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a medical AI assistant specializing in digestive health analysis. Provide detailed health insights considering the specific health scenario context.`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error analyzing ${filename} for scenario ${scenario.name}:`, error.message);
    return null;
  }
}

function validateAnalysisResult(analysis, scenario) {
  const validated = { ...analysis };

  // Ensure values match scenario constraints
  validated.bristol_score = Math.max(scenario.bristolRange[0],
    Math.min(scenario.bristolRange[1], Math.round(parseFloat(analysis.bristol_score) ||
      Math.floor((scenario.bristolRange[0] + scenario.bristolRange[1]) / 2))));

  validated.hydration_index = Math.max(scenario.hydrationRange[0],
    Math.min(scenario.hydrationRange[1], parseFloat(analysis.hydration_index) ||
      (scenario.hydrationRange[0] + scenario.hydrationRange[1]) / 2));

  validated.confidence = Math.max(0.5, Math.min(1.0, parseFloat(analysis.confidence) || 0.7));

  const validVolumes = ['low', 'medium', 'high'];
  validated.volume_estimate = validVolumes.includes(analysis.volume_estimate) ? analysis.volume_estimate : 'medium';

  validated.color = analysis.color || 'brown';
  validated.flags = Array.isArray(analysis.flags) ? analysis.flags : [];

  return validated;
}

async function insertAnalysisResult(imageData, analysisResult, filename, timestamp) {
  try {
    const { data, error } = await supabase
      .from('analysis_results')
      .insert({
        filename: filename,
        mime_type: imageData.mimeType,
        size: imageData.size,
        image_data: imageData.base64,
        device_id: getRandomDeviceId(),
        notes: `Scenario-based data: ${filename}`,
        bristol_score: analysisResult.bristol_score,
        color: analysisResult.color,
        volume_estimate: analysisResult.volume_estimate,
        hydration_index: analysisResult.hydration_index,
        flags: analysisResult.flags,
        confidence: analysisResult.confidence,
        analysis: analysisResult.analysis,
        gut_health_insights: analysisResult.gut_health_insights,
        medical_interpretation: analysisResult.medical_interpretation,
        created_at: timestamp.toISOString()
      });

    if (error) {
      console.error('Database insertion error:', error);
      return false;
    }

    console.log(`✓ Inserted ${filename} at ${timestamp.toLocaleString()}`);
    return true;
  } catch (error) {
    console.error('Error inserting analysis result:', error);
    return false;
  }
}

async function generateScenario(scenario, startDayOffset, imageFiles) {
  console.log(`\n🎬 Generating scenario: ${scenario.name}`);
  console.log(`Description: ${scenario.description}`);
  console.log(`Duration: ${scenario.duration} days`);

  let totalEntries = 0;

  for (let day = 0; day < scenario.duration; day++) {
    const dayOffset = startDayOffset + day;
    const entriesToday = Math.floor(Math.random() * (scenario.entriesPerDay[1] - scenario.entriesPerDay[0] + 1)) + scenario.entriesPerDay[0];

    if (entriesToday === 0) continue;

    console.log(`  Day ${day + 1}: ${entriesToday} entries`);

    for (let entry = 0; entry < entriesToday; entry++) {
      const imageFile = imageFiles[Math.floor(Math.random() * imageFiles.length)];
      const imagePath = path.join(IMAGE_DIR, imageFile);
      const mimeType = getImageMimeType(imageFile);
      const base64 = imageToBase64(imagePath);
      const size = fs.statSync(imagePath).size;

      // Random time during the day
      const timestamp = new Date(getRandomTimestamp(dayOffset, dayOffset - 1));

      const filename = `${scenario.name}_day${day + 1}_entry${entry + 1}_${imageFile}`;

      const analysis = await analyzeImageWithScenario(base64, mimeType, filename, scenario);

      if (analysis) {
        const validated = validateAnalysisResult(analysis, scenario);

        const success = await insertAnalysisResult(
          { base64, mimeType, size },
          validated,
          filename,
          timestamp
        );

        if (success) {
          totalEntries++;
        }
      }

      // Small delay between API calls
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  }

  console.log(`✅ Scenario complete: ${totalEntries} entries generated`);
  return totalEntries;
}

async function main() {
  console.log('🎥 Health Scenario Data Generator');
  console.log('=================================');

  const imageFiles = getImageFiles();
  console.log(`Found ${imageFiles.length} sample images`);

  let totalGenerated = 0;
  let currentDayOffset = 5; // Start 5 days ago

  // Generate each scenario
  for (const scenario of HEALTH_SCENARIOS) {
    const entries = await generateScenario(scenario, currentDayOffset, imageFiles);
    totalGenerated += entries;
    currentDayOffset += scenario.duration;

    // Delay between scenarios
    console.log('⏳ Waiting 3 seconds before next scenario...');
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  console.log(`\n🎉 All scenarios complete! Generated ${totalGenerated} total entries`);

  // Show database summary
  try {
    const { data, error } = await supabase
      .from('analysis_results')
      .select('count')
      .gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());

    if (error) {
      console.error('Error getting database summary:', error);
    } else {
      console.log(`📊 Database now contains ${data[0].count} total entries`);
    }
  } catch (error) {
    console.error('Error getting database summary:', error);
  }
}

main().catch(console.error);
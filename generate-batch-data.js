#!/usr/bin/env node

/**
 * Fast Batch Data Generator
 * Generates multiple entries concurrently for rapid data generation
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
require('dotenv').config({ path: '.env.local' });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const IMAGE_DIR = path.join(__dirname, 'data');

// Quick templates for different health states
const HEALTH_PROFILES = [
  {
    name: 'normal',
    bristol: 4,
    hydration: 0.7,
    flags: [],
    color: 'medium_brown',
    volume: 'medium'
  },
  {
    name: 'constipation',
    bristol: 2,
    hydration: 0.3,
    flags: ['constipation'],
    color: 'dark_brown',
    volume: 'low'
  },
  {
    name: 'diarrhea',
    bristol: 6,
    hydration: 0.85,
    flags: ['diarrhea'],
    color: 'yellow_brown',
    volume: 'high'
  },
  {
    name: 'mild_issues',
    bristol: 3,
    hydration: 0.5,
    flags: ['mild_constipation'],
    color: 'brown',
    volume: 'low'
  },
  {
    name: 'excellent',
    bristol: 4,
    hydration: 0.8,
    flags: ['optimal'],
    color: 'medium_brown',
    volume: 'medium'
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
  return ext === '.png' ? 'image/png' : 'image/jpeg';
}

function getRandomDeviceId() {
  const devices = ['toilet-clip-01', 'microbit-controller-01', 'senior-monitor-02', 'bathroom-sensor-01'];
  return devices[Math.floor(Math.random() * devices.length)];
}

function getRandomTimestamp(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(Math.floor(Math.random() * 24));
  date.setMinutes(Math.floor(Math.random() * 60));
  return date;
}

function generateInsights(profile) {
  const insights = {
    digestionStatus: '',
    dietaryImplications: '',
    potentialIssues: [],
    recommendations: [],
    followUpActions: []
  };

  switch (profile.name) {
    case 'normal':
      insights.digestionStatus = 'Normal healthy digestion';
      insights.dietaryImplications = 'Balanced diet supporting good digestive health';
      insights.recommendations = ['Maintain current diet', 'Stay hydrated'];
      insights.followUpActions = ['Continue regular monitoring'];
      break;
    case 'constipation':
      insights.digestionStatus = 'Signs of constipation detected';
      insights.dietaryImplications = 'Low fiber intake, increase fruits and vegetables';
      insights.potentialIssues = ['Constipation', 'Possible dehydration'];
      insights.recommendations = ['Increase fiber intake', 'Drink more water', 'Consider gentle exercise'];
      insights.followUpActions = ['Monitor for improvement', 'Consider dietary supplements'];
      break;
    case 'diarrhea':
      insights.digestionStatus = 'Loose stool consistency';
      insights.dietaryImplications = 'Possible digestive irritant or infection';
      insights.potentialIssues = ['Diarrhea', 'Risk of dehydration'];
      insights.recommendations = ['Stay hydrated', 'Eat bland foods', 'Monitor for triggers'];
      insights.followUpActions = ['Watch for improvement', 'Seek medical attention if persists'];
      break;
    case 'mild_issues':
      insights.digestionStatus = 'Mild digestive irregularity';
      insights.dietaryImplications = 'Minor dietary adjustments needed';
      insights.potentialIssues = ['Mild constipation'];
      insights.recommendations = ['Increase water intake', 'Add more fiber to diet'];
      insights.followUpActions = ['Monitor symptoms', 'Consider dietary changes'];
      break;
    case 'excellent':
      insights.digestionStatus = 'Excellent digestive health';
      insights.dietaryImplications = 'Optimal diet for digestive health';
      insights.recommendations = ['Maintain current eating habits', 'Continue good hydration'];
      insights.followUpActions = ['Continue current routine', 'No changes needed'];
      break;
  }

  return insights;
}

function generateMedicalInterpretation(profile) {
  const interpretation = {
    possibleConditions: [],
    urgencyLevel: 'low',
    whenToConsultDoctor: 'No immediate medical attention needed',
    redFlags: []
  };

  switch (profile.name) {
    case 'normal':
      interpretation.possibleConditions = ['Normal bowel function'];
      break;
    case 'constipation':
      interpretation.possibleConditions = ['Constipation', 'Dehydration'];
      interpretation.urgencyLevel = 'medium';
      interpretation.whenToConsultDoctor = 'Monitor and consult if persists for more than 3 days';
      interpretation.redFlags = ['Persistent constipation'];
      break;
    case 'diarrhea':
      interpretation.possibleConditions = ['Diarrhea', 'Possible gastroenteritis'];
      interpretation.urgencyLevel = 'medium';
      interpretation.whenToConsultDoctor = 'Monitor hydration and consult if persists more than 2 days';
      interpretation.redFlags = ['Risk of dehydration'];
      break;
    case 'mild_issues':
      interpretation.possibleConditions = ['Mild constipation'];
      interpretation.urgencyLevel = 'low';
      interpretation.whenToConsultDoctor = 'Monitor for worsening symptoms';
      break;
    case 'excellent':
      interpretation.possibleConditions = ['Optimal digestive health'];
      break;
  }

  return interpretation;
}

async function quickAnalyzeImage(imageBase64, mimeType, profile) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a medical AI assistant. Analyze this toilet bowl image quickly and provide a brief analysis focusing on:
          - Bristol score (expecting around ${profile.bristol})
          - Hydration index (expecting around ${profile.hydration})
          - Color assessment
          - Volume estimation
          - Confidence level

          Keep it concise but accurate. Return JSON with these fields.`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Quick analysis needed for ${profile.name} health profile. Expected Bristol: ${profile.bristol}, Hydration: ${profile.hydration}`
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
      max_tokens: 500,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Quick analysis failed:', error.message);
    return null;
  }
}

async function insertBatchEntry(imageData, profile, filename, timestamp) {
  try {
    // Get quick AI analysis
    const analysis = await quickAnalyzeImage(imageData.base64, imageData.mimeType, profile);

    // Use AI analysis or fall back to profile
    const bristol_score = analysis ? Math.round(parseFloat(analysis.bristol_score) || profile.bristol) : profile.bristol;
    const hydration_index = analysis ? Math.max(0.1, Math.min(1.0, parseFloat(analysis.hydration_index) || profile.hydration)) : profile.hydration;
    const confidence = analysis ? Math.max(0.5, Math.min(1.0, parseFloat(analysis.confidence) || 0.8)) : 0.8;
    const color = analysis?.color || profile.color;
    const volume_estimate = analysis?.volume_estimate || profile.volume;

    const result = {
      filename,
      mime_type: imageData.mimeType,
      size: imageData.size,
      image_data: imageData.base64,
      device_id: getRandomDeviceId(),
      notes: `Batch generated: ${profile.name} profile`,
      bristol_score: Math.max(1, Math.min(7, bristol_score)),
      color,
      volume_estimate,
      hydration_index,
      flags: profile.flags,
      confidence,
      analysis: analysis?.analysis || `${profile.name} digestive state detected`,
      gut_health_insights: generateInsights(profile),
      medical_interpretation: generateMedicalInterpretation(profile),
      created_at: timestamp.toISOString()
    };

    const { error } = await supabase
      .from('analysis_results')
      .insert(result);

    if (error) {
      console.error('Insert error:', error);
      return false;
    }

    console.log(`✓ ${filename} - ${profile.name} (${result.bistol_score}, ${result.hydration_index.toFixed(2)})`);
    return true;
  } catch (error) {
    console.error('Batch insert error:', error);
    return false;
  }
}

async function generateBatch(size = 50) {
  console.log(`🚀 Generating ${size} batch entries...`);

  const imageFiles = getImageFiles();
  const profiles = HEALTH_PROFILES;

  let generated = 0;
  const batchSize = 5; // Process 5 concurrently

  for (let i = 0; i < size; i += batchSize) {
    const batchPromises = [];

    for (let j = 0; j < batchSize && (i + j) < size; j++) {
      const imageFile = imageFiles[Math.floor(Math.random() * imageFiles.length)];
      const profile = profiles[Math.floor(Math.random() * profiles.length)];
      const daysAgo = Math.floor(Math.random() * 60) + 1;

      const imagePath = path.join(IMAGE_DIR, imageFile);
      const filename = `batch_${i + j + 1}_${profile.name}_${imageFile}`;

      batchPromises.push(
        insertBatchEntry(
          {
            base64: imageToBase64(imagePath),
            mimeType: getImageMimeType(imageFile),
            size: fs.statSync(imagePath).size
          },
          profile,
          filename,
          getRandomTimestamp(daysAgo)
        )
      );
    }

    const results = await Promise.allSettled(batchPromises);
    const successful = results.filter(r => r.status === 'fulfilled' && r.value).length;
    generated += successful;

    console.log(`📊 Progress: ${generated}/${size} entries`);

    // Small delay between batches
    if (i + batchSize < size) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return generated;
}

async function main() {
  console.log('⚡ Fast Batch Data Generator');
  console.log('============================');

  const targetSize = parseInt(process.argv[2]) || 30;
  console.log(`Target: ${targetSize} entries`);

  const startTime = Date.now();
  const generated = await generateBatch(targetSize);
  const duration = (Date.now() - startTime) / 1000;

  console.log(`\n🎉 Generated ${generated} entries in ${duration.toFixed(1)}s`);
  console.log(`⚡ Average: ${(duration / generated).toFixed(2)}s per entry`);

  // Database summary
  try {
    const { data, error } = await supabase
      .from('analysis_results')
      .select('count');

    if (!error) {
      console.log(`📊 Total database entries: ${data[0].count}`);
    }
  } catch (error) {
    console.error('Error getting database count:', error);
  }
}

main().catch(console.error);
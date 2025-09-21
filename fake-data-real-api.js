#!/usr/bin/env node

/**
 * Enhanced Fake Data Script using Real OpenAI API
 * Based on the original SQL structure but using actual image analysis
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

// Device IDs
const DEVICES = ['toilet-clip-01', 'microbit-controller-01', 'senior-monitor-02', 'bathroom-sensor-01'];

// Helper functions
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
  return DEVICES[Math.floor(Math.random() * DEVICES.length)];
}

function getRandomTimestamp(startDays, endDays = 0) {
  const start = new Date();
  start.setDate(start.getDate() - startDays);

  const end = new Date();
  end.setDate(end.getDate() - endDays);

  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTime);
}

// Advanced analysis with medical context
async function analyzeImageWithContext(imageBase64, mimeType, context) {
  try {
    const systemPrompt = `You are a specialized medical AI assistant for digestive health analysis. Analyze the provided toilet bowl image and return detailed health insights.

Context: ${context}

Bristol Scale Reference:
1: Hard lumps (severe constipation)
2: Lumpy sausage (mild constipation)
3: Cracked sausage (normal)
4: Smooth snake (ideal)
5: Soft blobs (mild diarrhea)
6: Fluffy pieces (diarrhea)
7: Watery (severe diarrhea)

Return JSON with:
{
  "bristol_score": number (1-7),
  "color": string,
  "volume_estimate": string ("low", "medium", "high"),
  "hydration_index": number (0.1-1.0),
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

Be medically accurate and conservative.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this image for digestive health assessment. ${context}`
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
    console.error('Analysis error:', error.message);
    return null;
  }
}

// Validate and sanitize data
function validateAnalysisResult(analysis, expectedBristol = null) {
  const validated = { ...analysis };

  // Bristol score validation
  if (expectedBristol) {
    validated.bristol_score = Math.max(1, Math.min(7, Math.round(expectedBristol)));
  } else {
    validated.bristol_score = Math.max(1, Math.min(7, Math.round(parseFloat(analysis.bristol_score) || 4)));
  }

  // Hydration index
  validated.hydration_index = Math.max(0.1, Math.min(1.0, parseFloat(analysis.hydration_index) || 0.5));

  // Confidence
  validated.confidence = Math.max(0.5, Math.min(1.0, parseFloat(analysis.confidence) || 0.7));

  // Volume estimate
  const validVolumes = ['low', 'medium', 'high'];
  validated.volume_estimate = validVolumes.includes(analysis.volume_estimate) ? analysis.volume_estimate : 'medium';

  // Color
  validated.color = analysis.color || 'brown';

  // Flags
  validated.flags = Array.isArray(analysis.flags) ? analysis.flags : [];

  return validated;
}

// Insert analysis result
async function insertAnalysisResult(imageData, analysis, filename, timestamp) {
  try {
    const result = {
      filename,
      mime_type: imageData.mimeType,
      size: imageData.size,
      image_data: imageData.base64,
      device_id: getRandomDeviceId(),
      notes: `Real API analysis: ${analysis.notes || 'Sample data'}`,
      bristol_score: analysis.bristol_score,
      color: analysis.color,
      volume_estimate: analysis.volume_estimate,
      hydration_index: analysis.hydration_index,
      flags: analysis.flags,
      confidence: analysis.confidence,
      analysis: analysis.analysis,
      gut_health_insights: analysis.gut_health_insights,
      medical_interpretation: analysis.medical_interpretation,
      created_at: timestamp.toISOString()
    };

    const { error } = await supabase
      .from('analysis_results')
      .insert(result);

    if (error) {
      console.error('Insert error:', error);
      return false;
    }

    console.log(`✓ ${filename} - Bristol: ${analysis.bristol_score}, Hydration: ${analysis.hydration_index.toFixed(2)}`);
    return true;
  } catch (error) {
    console.error('Insert error:', error);
    return false;
  }
}

// Generate random sample data
async function generateRandomSamples(days = 60, entriesPerDay = 2) {
  console.log(`🎲 Generating random samples for ${days} days...`);

  const imageFiles = getImageFiles();
  let totalGenerated = 0;

  for (let day = 0; day < days; day++) {
    const dayEntries = Math.floor(Math.random() * entriesPerDay);

    for (let entry = 0; entry < dayEntries; entry++) {
      const imageFile = imageFiles[Math.floor(Math.random() * imageFiles.length)];
      const imagePath = path.join(IMAGE_DIR, imageFile);
      const timestamp = getRandomTimestamp(day, day - 1);

      const analysis = await analyzeImageWithContext(
        imageToBase64(imagePath),
        getImageMimeType(imageFile),
        `Random daily entry, day ${day + 1}`
      );

      if (analysis) {
        const validated = validateAnalysisResult(analysis);

        const success = await insertAnalysisResult(
          {
            base64: imageToBase64(imagePath),
            mimeType: getImageMimeType(imageFile),
            size: fs.statSync(imagePath).size
          },
          { ...validated, notes: `Random sample day ${day + 1}` },
          `random_day${day + 1}_entry${entry + 1}_${imageFile}`,
          timestamp
        );

        if (success) totalGenerated++;
      }

      // Small delay
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return totalGenerated;
}

// Generate improving trend
async function generateImprovingTrend() {
  console.log('📈 Generating improving trend...');

  const imageFiles = getImageFiles();
  let totalGenerated = 0;

  for (let i = 0; i <= 5; i++) {
    const imageFile = imageFiles[Math.floor(Math.random() * imageFiles.length)];
    const imagePath = path.join(IMAGE_DIR, imageFile);
    const timestamp = getRandomTimestamp(25 + i, 25 + i - 1);

    const expectedBristol = 2 + i; // Improving from 2 to 7
    const context = `Improving trend, day ${i + 1}, expected Bristol score around ${expectedBristol}`;

    const analysis = await analyzeImageWithContext(
      imageToBase64(imagePath),
      getImageMimeType(imageFile),
      context
    );

    if (analysis) {
      const validated = validateAnalysisResult(analysis, expectedBristol);

      const success = await insertAnalysisResult(
        {
          base64: imageToBase64(imagePath),
          mimeType: getImageMimeType(imageFile),
          size: fs.statSync(imagePath).size
        },
        { ...validated, notes: `Improving trend day ${i + 1}` },
        `improving_trend_day${i + 1}_${imageFile}`,
        timestamp
      );

      if (success) totalGenerated++;
    }

    await new Promise(resolve => setTimeout(resolve, 800));
  }

  return totalGenerated;
}

// Generate concerning pattern
async function generateConcerningPattern() {
  console.log('⚠️ Generating concerning pattern...');

  const imageFiles = getImageFiles();
  let totalGenerated = 0;

  for (let i = 0; i < 7; i++) {
    const imageFile = imageFiles[Math.floor(Math.random() * imageFiles.length)];
    const imagePath = path.join(IMAGE_DIR, imageFile);
    const timestamp = getRandomTimestamp(10 + i, 10 + i - 1);

    const context = 'Concerning pattern with high Bristol scores (6-7), possible diarrhea';

    const analysis = await analyzeImageWithContext(
      imageToBase64(imagePath),
      getImageMimeType(imageFile),
      context
    );

    if (analysis) {
      const validated = validateAnalysisResult(analysis);
      // Ensure concerning pattern
      validated.bristol_score = Math.max(6, validated.bristol_score);
      validated.flags = [...validated.flags, 'diarrhea', 'concerning_pattern'];

      const success = await insertAnalysisResult(
        {
          base64: imageToBase64(imagePath),
          mimeType: getImageMimeType(imageFile),
          size: fs.statSync(imagePath).size
        },
        { ...validated, notes: `Concerning pattern day ${i + 1}` },
        `concerning_pattern_day${i + 1}_${imageFile}`,
        timestamp
      );

      if (success) totalGenerated++;
    }

    await new Promise(resolve => setTimeout(resolve, 800));
  }

  return totalGenerated;
}

// Generate acute episode
async function generateAcuteEpisode() {
  console.log('🚨 Generating acute episode...');

  const imageFiles = getImageFiles();
  let totalGenerated = 0;

  // Day 1: Acute phase (4 entries)
  for (let i = 0; i < 4; i++) {
    const imageFile = imageFiles[Math.floor(Math.random() * imageFiles.length)];
    const imagePath = path.join(IMAGE_DIR, imageFile);
    const timestamp = new Date(getRandomTimestamp(5, 4));
    timestamp.setHours(timestamp.getHours() - i * 3); // Spread throughout day

    const context = 'Acute gastroenteritis episode, severe watery diarrhea';

    const analysis = await analyzeImageWithContext(
      imageToBase64(imagePath),
      getImageMimeType(imageFile),
      context
    );

    if (analysis) {
      const validated = validateAnalysisResult(analysis);
      validated.bristol_score = 7; // Severe diarrhea
      validated.hydration_index = Math.max(0.85, validated.hydration_index);
      validated.flags = ['diarrhea', 'dehydration_risk', 'acute_episode'];

      const success = await insertAnalysisResult(
        {
          base64: imageToBase64(imagePath),
          mimeType: getImageMimeType(imageFile),
          size: fs.statSync(imagePath).size
        },
        { ...validated, notes: 'Acute episode day 1' },
        `acute_episode_1_${i + 1}_${imageFile}`,
        timestamp
      );

      if (success) totalGenerated++;
    }

    await new Promise(resolve => setTimeout(resolve, 600));
  }

  // Day 2: Recovery (3 entries)
  for (let i = 0; i < 3; i++) {
    const imageFile = imageFiles[Math.floor(Math.random() * imageFiles.length)];
    const imagePath = path.join(IMAGE_DIR, imageFile);
    const timestamp = new Date(getRandomTimestamp(4, 3));
    timestamp.setHours(timestamp.getHours() - i * 4);

    const context = 'Recovery phase, improving but still loose stool';

    const analysis = await analyzeImageWithContext(
      imageToBase64(imagePath),
      getImageMimeType(imageFile),
      context
    );

    if (analysis) {
      const validated = validateAnalysisResult(analysis);
      validated.bristol_score = 6; // Still loose but improving
      validated.flags = ['diarrhea', 'recovering'];

      const success = await insertAnalysisResult(
        {
          base64: imageToBase64(imagePath),
          mimeType: getImageMimeType(imageFile),
          size: fs.statSync(imagePath).size
        },
        { ...validated, notes: 'Acute episode day 2 recovery' },
        `acute_episode_2_${i + 1}_${imageFile}`,
        timestamp
      );

      if (success) totalGenerated++;
    }

    await new Promise(resolve => setTimeout(resolve, 600));
  }

  return totalGenerated;
}

// Main function
async function main() {
  console.log('🏥 Enhanced Fake Data Generator with Real OpenAI API');
  console.log('===================================================');

  const startTime = Date.now();
  let totalGenerated = 0;

  // Generate different types of data
  console.log('\n🎲 Generating random samples...');
  const randomCount = await generateRandomSamples(30, 1); // 30 days, 1 entry per day average
  totalGenerated += randomCount;

  console.log('\n📈 Generating improving trend...');
  const improvingCount = await generateImprovingTrend();
  totalGenerated += improvingCount;

  console.log('\n⚠️ Generating concerning pattern...');
  const concerningCount = await generateConcerningPattern();
  totalGenerated += concerningCount;

  console.log('\n🚨 Generating acute episode...');
  const acuteCount = await generateAcuteEpisode();
  totalGenerated += acuteCount;

  const duration = (Date.now() - startTime) / 1000;

  console.log(`\n🎉 Data generation complete!`);
  console.log(`📊 Generated ${totalGenerated} total entries in ${duration.toFixed(1)}s`);
  console.log(`⚡ Average: ${(duration / totalGenerated).toFixed(2)}s per entry`);

  // Database summary
  try {
    const { data, error } = await supabase
      .from('analysis_results')
      .select('count');

    if (!error) {
      console.log(`🗄️ Total database entries: ${data[0].count}`);
    }
  } catch (error) {
    console.error('Error getting database count:', error);
  }
}

main().catch(console.error);
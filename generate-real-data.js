#!/usr/bin/env node

/**
 * Real Data Generator Script
 * Uses actual images from data/ directory and calls OpenAI API for real analysis
 * Generates realistic health monitoring data with proper API responses
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

if (!OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Image directory
const IMAGE_DIR = path.join(__dirname, 'data');

// Get all image files
function getImageFiles() {
  const files = fs.readdirSync(IMAGE_DIR);
  return files.filter(file => file.match(/\.(jpg|jpeg|png)$/i));
}

// Convert image to base64
function imageToBase64(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);
  return imageBuffer.toString('base64');
}

// Get image mime type
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

// Call OpenAI API for image analysis
async function analyzeImage(imageBase64, mimeType, filename) {
  try {
    console.log(`Analyzing image: ${filename}`);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a medical AI assistant specializing in digestive health analysis. Analyze the provided toilet bowl image and provide detailed health insights.

Return a JSON response with the following structure:
{
  "bristol_score": number (1-7),
  "color": string (e.g., "brown", "light_brown", "dark_brown", "yellow_brown"),
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

Bristol Scale Reference:
1: Hard lumps, difficult to pass (severe constipation)
2: Lumpy, sausage-like (mild constipation)
3: Cracked sausage, normal (normal)
4: Smooth snake, normal (ideal)
5: Soft blobs (mild diarrhea)
6: Fluffy pieces (diarrhea)
7: Watery, no solid pieces (severe diarrhea)

Be medically accurate and conservative in your assessment.`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this toilet bowl image for digestive health assessment. Provide Bristol score, hydration levels, and medical insights."
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
    console.error(`Error analyzing ${filename}:`, error.message);
    return null;
  }
}

// Generate random device ID
function getRandomDeviceId() {
  const devices = ['toilet-clip-01', 'microbit-controller-01', 'senior-monitor-02', 'bathroom-sensor-01'];
  return devices[Math.floor(Math.random() * devices.length)];
}

// Generate random timestamp within date range
function getRandomTimestamp(startDays, endDays = 0) {
  const start = new Date();
  start.setDate(start.getDate() - startDays);

  const end = new Date();
  end.setDate(end.getDate() - endDays);

  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTime);
}

// Insert analysis result into database
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
        notes: `Real sample data generated from ${filename}`,
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

    console.log(`✓ Inserted analysis for ${filename} at ${timestamp.toLocaleString()}`);
    return true;
  } catch (error) {
    console.error('Error inserting analysis result:', error);
    return false;
  }
}

// Validate and sanitize analysis result
function validateAnalysisResult(analysis) {
  const validated = { ...analysis };

  // Ensure bristol_score is integer 1-7
  validated.bristol_score = Math.max(1, Math.min(7, Math.round(parseFloat(analysis.bristol_score) || 4)));

  // Ensure hydration_index is float 0.1-1.0
  validated.hydration_index = Math.max(0.1, Math.min(1.0, parseFloat(analysis.hydration_index) || 0.5));

  // Ensure confidence is float 0.5-1.0
  validated.confidence = Math.max(0.5, Math.min(1.0, parseFloat(analysis.confidence) || 0.7));

  // Ensure volume_estimate is one of allowed values
  const validVolumes = ['low', 'medium', 'high'];
  validated.volume_estimate = validVolumes.includes(analysis.volume_estimate) ? analysis.volume_estimate : 'medium';

  // Ensure color is string
  validated.color = analysis.color || 'brown';

  // Ensure flags is array
  validated.flags = Array.isArray(analysis.flags) ? analysis.flags : [];

  return validated;
}

// Process multiple entries for the same image with variations
async function processImageVariations(filename, variations = 3) {
  const imagePath = path.join(IMAGE_DIR, filename);
  const mimeType = getImageMimeType(filename);
  const base64 = imageToBase64(imagePath);
  const size = fs.statSync(imagePath).size;

  console.log(`Processing ${filename} with ${variations} variations...`);

  const results = [];

  // Generate variations with different timestamps and slight modifications
  for (let i = 0; i < variations; i++) {
    const timestamp = getRandomTimestamp(60, 0); // Last 60 days

    // Get base analysis
    const analysis = await analyzeImage(base64, mimeType, `${filename}_var${i+1}`);

    if (analysis) {
      // Validate and create variations
      const validated = validateAnalysisResult(analysis);

      // Create slight variations for different entries
      const variation = {
        ...validated,
        bristol_score: Math.max(1, Math.min(7, validated.bristol_score + Math.floor((Math.random() - 0.5) * 2))),
        hydration_index: Math.max(0.1, Math.min(1.0, validated.hydration_index + (Math.random() - 0.5) * 0.2)),
        confidence: Math.max(0.5, Math.min(1.0, validated.confidence + (Math.random() - 0.5) * 0.1))
      };

      const success = await insertAnalysisResult(
        { base64, mimeType, size },
        variation,
        `var_${i+1}_${filename}`,
        timestamp
      );

      if (success) {
        results.push(variation);
      }
    }

    // Small delay between API calls
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return results;
}

// Main function
async function main() {
  console.log('🚀 Starting real data generation with OpenAI API analysis...');

  const imageFiles = getImageFiles();
  console.log(`Found ${imageFiles.length} sample images:`, imageFiles);

  let totalGenerated = 0;
  const totalVariations = 2; // Variations per image

  // Process images in parallel batches
  const batchSize = 2; // Process 2 images at a time

  for (let i = 0; i < imageFiles.length; i += batchSize) {
    const batch = imageFiles.slice(i, i + batchSize);
    console.log(`\nProcessing batch ${Math.floor(i / batchSize) + 1}: ${batch.join(', ')}`);

    const batchPromises = batch.map(filename =>
      processImageVariations(filename, totalVariations)
    );

    const batchResults = await Promise.allSettled(batchPromises);

    batchResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        totalGenerated += result.value.length;
        console.log(`✓ Completed ${batch[index]}: ${result.value.length} variations`);
      } else {
        console.error(`✗ Failed ${batch[index]}:`, result.reason.message);
      }
    });

    // Delay between batches
    if (i + batchSize < imageFiles.length) {
      console.log('⏳ Waiting 5 seconds before next batch...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.log(`\n🎉 Data generation complete! Generated ${totalGenerated} total entries`);

  // Show database summary
  try {
    const { data, error } = await supabase
      .from('analysis_results')
      .select('count')
      .gte('created_at', new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString());

    if (error) {
      console.error('Error getting database summary:', error);
    } else {
      console.log(`📊 Database now contains ${data[0].count} entries from the last 60 days`);
    }
  } catch (error) {
    console.error('Error getting database summary:', error);
  }
}

// Run the script
main().catch(console.error);
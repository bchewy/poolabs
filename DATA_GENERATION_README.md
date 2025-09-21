# Real Data Generation with OpenAI API

This system replaces the fake SQL data generator with real image analysis using OpenAI's GPT-4o-mini vision model.

## Available Scripts

### 1. Basic Real Data Generation
```bash
npm run generate-data
```
- Uses real images from `data/` directory
- Calls OpenAI API for each image analysis
- Generates 2 variations per image
- Creates realistic entries with proper medical insights

### 2. Fast Batch Generation
```bash
npm run generate-batch [count]
```
Example: `npm run generate-batch 20`
- Generates entries concurrently for speed
- Uses health profiles (normal, constipation, diarrhea, etc.)
- Much faster (~1 second per entry)
- Good for quickly populating database

### 3. Enhanced Scenario Generation
```bash
npm run generate-enhanced
```
- Creates comprehensive health scenarios
- Includes improving trends, concerning patterns, acute episodes
- Uses context-aware API calls
- Most realistic medical data patterns

### 4. Health Scenarios (Long-form)
```bash
npm run generate-scenarios
```
- Creates detailed multi-day scenarios
- Simulates complete health episodes
- Very comprehensive but slower

## Key Features

### Real API Integration
- All scripts use actual OpenAI GPT-4o-mini vision model
- Real medical analysis of your sample images
- Proper Bristol scoring and hydration assessment
- Comprehensive health insights and medical interpretation

### Database Integration
- Automatic insertion into Supabase database
- Proper data validation and sanitization
- Realistic timestamps and device IDs
- Maintains data integrity constraints

### Health Patterns
- **Normal health**: Regular bowel movements (Bristol 3-5)
- **Constipation**: Hard stools, low hydration (Bristol 1-2)
- **Diarrhea**: Loose stools, high hydration (Bristol 6-7)
- **Acute episodes**: Severe symptoms requiring attention
- **Recovery phases**: Improving health trends
- **Concerning patterns**: Persistent abnormal symptoms

## Sample Images Used

The system uses all images found in the `data/` directory:
- `sample-clean.jpg`
- `sample1.jpg`
- `sample2.jpg`
- `sample3.jpg`
- `sample4.jpg`

## Data Structure

Each generated entry includes:
- **Image Data**: Base64-encoded real images
- **AI Analysis**: Actual OpenAI API responses
- **Medical Insights**: Generated health recommendations
- **Flags**: Automated health condition detection
- **Device Information**: Random device assignment
- **Timestamps**: Realistic time distribution

## Usage Examples

### Quick Test
```bash
# Generate 10 entries quickly
npm run generate-batch 10
```

### Comprehensive Dataset
```bash
# Generate detailed health scenarios
npm run generate-enhanced
```

### Check Results
```bash
# View database entries (use Supabase dashboard)
# Or check the application at http://localhost:3000
```

## Performance

- **Batch Generation**: ~1 second per entry
- **Enhanced Generation**: ~5-10 seconds per entry
- **API Rate Limits**: Built-in delays to respect OpenAI limits
- **Concurrent Processing**: Batch processing for efficiency

## Next Steps

1. Run one of the generation scripts
2. Check the database for generated entries
3. View the data in the web application
4. Analyze the health trends and patterns

The system now provides realistic, medically-accurate test data based on actual image analysis rather than synthetic fake data.
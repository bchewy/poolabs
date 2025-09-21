# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PooLabs is a senior health monitoring system featuring a discreet toilet-clip device that privately detects bowel events and flags constipation/diarrhea trends for seniors living alone. The system processes sensor data locally without saving photos, only generating discrete health labels and trends for caregiver awareness.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server on `http://localhost:3000`
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Operations
- Database migrations are in `src/lib/migrations.sql`
- Use Supabase dashboard for direct database management
- API endpoints handle database operations through `src/lib/database.ts`

## Architecture Overview

### Frontend Structure
- **Next.js 15** with App Router (`src/app/`)
- **React 19** with TypeScript for type safety
- **Tailwind CSS v4** with custom theme system
- **Component library** in `src/components/` for reusable UI elements

### Backend Architecture
- **Next.js API Routes** in `src/app/api/` for serverless endpoints
- **Supabase** for database and authentication
- **OpenAI API** integration for AI-powered image analysis
- **ESP32-CAM** hardware integration in `/poo_cam/` directory

### Key Directories
- `src/app/` - Next.js App Router pages and API endpoints
- `src/components/` - Reusable React components
- `src/lib/` - Core business logic and database operations
- `src/styles/` - Custom CSS and theme variables
- `poo_cam/` - ESP32-CAM Arduino project for IoT integration

## Database Schema

The application uses a single `analysis_results` table with comprehensive health tracking:
- **Image Data**: Base64 encoded images with metadata
- **Bristol Scoring**: 1-7 scale for stool classification
- **Health Metrics**: Hydration index, volume estimation, gut health insights
- **AI Analysis**: Medical interpretation and confidence scores
- **Event Flags**: Boolean flags for various health conditions

## Key Patterns & Conventions

### API Structure
- API endpoints follow RESTful conventions in `src/app/api/`
- Each endpoint handles specific operations (analyses, events, upload, migrate)
- Database operations centralized in `src/lib/database.ts`

### Component Architecture
- Reusable components in `src/components/`
- Custom theme system with CSS variables
- Responsive design with Tailwind CSS
- Dark mode support through theme selector

### Type Safety
- Comprehensive TypeScript interfaces in `src/lib/types.ts`
- Strict TypeScript configuration enabled
- Input validation through type definitions

### AI Integration
- OpenAI vision API for image analysis
- Analysis results stored in database with confidence scores
- Health insights generated through AI interpretation

## Hardware Integration

The ESP32-CAM project in `/poo_cam/` provides:
- Automated image capture capabilities
- HTTP server for image serving
- IoT device integration with the web application
- Real-time data collection from hardware devices

## Security Considerations

- Row Level Security (RLS) enabled on Supabase database
- Environment variables for API keys and secrets
- Input validation through TypeScript interfaces
- Anonymous access policies for public API endpoints

## Design System

### Color Scheme
- Primary: `#f59e0b` (Amber) for health-themed elements
- Secondary: Blue tones for technical components
- Status colors: Green (success), Amber (warning), Red (danger)
- Dark mode support with custom CSS variables

### UI Patterns
- Glass morphism effects for modern appearance
- Smooth animations and transitions
- Grid background patterns
- Custom scrollbar styling
- Responsive design patterns for all screen sizes
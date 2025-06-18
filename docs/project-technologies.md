# Mental Health Support AI - Technologies Documentation

This document provides an overview of all technologies, libraries, and tools used in the Mental Health Support AI project.

## Core Technologies

### Frontend Framework
- **Next.js** (App Router) - React framework for building the user interface with server-side rendering capabilities
- **React** - JavaScript library for building user interfaces
- **TypeScript** - Typed superset of JavaScript for improved developer experience and code quality

### AI and Machine Learning
- **Google Gemini API** - Powers the AI chatbot functionality, emotion detection, and text translation
- **AI SDK** - Vercel's AI SDK for streamlined AI integration
- **@ai-sdk/google** - Google AI provider for the AI SDK

### UI Components
- **shadcn/ui** - Component library built on Radix UI
- **Radix UI** - Unstyled, accessible UI components
- **Lucide React** - Icon library

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **class-variance-authority** - For creating variant components with Tailwind

### State Management
- **React Hooks** - For component-level state management
- **localStorage** - For persisting user preferences and settings

## Data Visualization
- **Recharts** - Charting library for mood tracking visualization

## Utilities and Helpers
- **date-fns** - Date manipulation library
- **clsx/cn** - Utility for conditional class names
- **SpeechRecognition API** - For voice input functionality

## External APIs
- **Google Translate API** - Used as a fallback for translation when the Gemini API is unavailable
- **Web Speech API** - For speech recognition

## Browser APIs
- **MediaDevices API** - For accessing the user's camera for emotion detection
- **Canvas API** - For processing camera images
- **Clipboard API** - For copying API keys
- **Web Storage API** - For storing user preferences and settings

## Data Storage
- **localStorage** - Client-side storage for:
  - User preferences
  - API keys
  - Language settings
  - Theme preferences
  - Feature toggles

## Features

### AI-Powered Features
- **Emotion Detection** - Analyzes text to detect user emotions
- **Facial Emotion Recognition** - Simulated facial emotion detection
- **Multilingual Support** - Support for English and Hindi with automatic translation
- **Personality Modes** - Different AI personalities (Supportive Friend, Therapist, Coach)

### User Experience
- **Dark/Light Mode** - Theme switching capability
- **Responsive Design** - Mobile and desktop friendly interface
- **Voice Input** - Speech-to-text for message input
- **Offline Mode** - Fallback responses when API is unavailable

### Mental Health Tools
- **Mood Tracking** - Visual tracking of emotional states over time
- **Journaling** - Text-based journal entries tied to emotional states
- **Crisis Resources** - Emergency resources for mental health crises

## Project Structure

### Key Directories
- `/app` - Next.js app router pages and layouts
- `/components` - React components
- `/lib` - Utility functions and type definitions
- `/public` - Static assets and models
- `/docs` - Project documentation

### Key Files
- `lib/types.ts` - TypeScript type definitions
- `lib/ai-helpers.ts` - AI-related utility functions
- `lib/api-config.ts` - API key management
- `components/chat.tsx` - Main chat interface
- `components/face-emotion-detector.tsx` - Emotion detection from facial expressions

## Development Tools
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **npm/pnpm** - Package management

## Removed/Deprecated Features
- **Authentication System** - JWT-based authentication was removed for simplicity
- **Server-side Database** - Removed in favor of client-side storage

## Environment Variables
- `GOOGLE_API_KEY` - Google Gemini API key for AI functionality

## Browser Compatibility
The application is designed to work on modern browsers that support:
- ES6+ JavaScript
- Web APIs (localStorage, MediaDevices, Canvas, etc.)
- CSS Grid and Flexbox

## Performance Considerations
- Lazy loading of heavy components
- Optimized re-renders with proper React patterns
- Client-side caching of API responses
- Fallback mechanisms for offline/API failure scenarios

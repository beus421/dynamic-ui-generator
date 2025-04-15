# Dynamic UI Generator

A modern web application that leverages Google's Gemini AI to generate dynamic React components based on text descriptions.

![Dynamic UI Generator](https://placehold.co/600x400?text=Dynamic+UI+Generator)

## Features

- 🧠 Uses Gemini AI to generate React components from text descriptions
- 🎨 Creates components with Tailwind CSS styling
- 🔄 Instantly renders the generated components
- 📱 Responsive design works on all devices
- 🛡️ Safe rendering of dynamic content
- 🔌 Simple API key configuration

## Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- A Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone [your-repo-url]
   cd dynamic-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

### Step 1: Set Your API Key

Before generating components, you need to set your Google Gemini API key:

1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Enter your API key in the settings panel of the app

### Step 2: Generate Components

1. Select the type of component you want to create (e.g., Button, Card, Form)
2. Describe what the component should look like and do
3. Add optional style preferences
4. Click "Generate Component"
5. The AI will create and render your component instantly!

## Examples

Try these descriptions for interesting results:

- "A neon-styled call-to-action button with hover effects"
- "A dashboard card showing user statistics with a colorful graph"
- "A Pokémon card style profile for a web developer"
- "A music player interface with play/pause controls"

## How It Works

The Dynamic UI Generator uses a series of technologies to bring your ideas to life:

1. **Frontend**: Next.js with React and Tailwind CSS
2. **AI Integration**: Google's Gemini AI model via their API
3. **Safe Rendering**: JSX parsing with React-Live or HTML sanitization
4. **API Layer**: Next.js API routes for communication with Gemini

## Technical Details

### Component Generation Process

1. Your description is sent to the Gemini API with specific prompts to generate valid JSX
2. The JSX is returned and processed for safety
3. The component is rendered using either:
   - JSX Parser (React-Live) for complex components
   - HTML sanitization for simpler components

### File Structure

```
dynamic-ui/
├── src/
│   ├── app/              # Next.js app router
│   ├── components/       # React components
│   │   ├── DynamicComponent.tsx  # Renders dynamic JSX
│   │   └── UIGenerator.tsx       # UI for component generation
│   └── lib/              # Utility functions
│       └── jsx-parser.tsx        # JSX parsing utilities
└── public/               # Static assets
```

## Troubleshooting

### Component Not Rendering

- Check browser console for errors
- Ensure your API key is correctly set
- Try simpler component descriptions first

### API Connection Issues

- Verify your internet connection
- Check if the Gemini API is experiencing downtime
- Ensure your API key has not expired

### Tech Stack

- Google Gemini for AI capabilities
- Next.js for the React framework
- Tailwind CSS for styling
- React-Live for JSX parsing



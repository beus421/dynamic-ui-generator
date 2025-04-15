import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Store API key in memory (for demo purposes only)
let geminiApiKey = '';

// Initialize Gemini API
function getGeminiClient() {
  if (!geminiApiKey) return null;
  return new GoogleGenerativeAI(geminiApiKey);
}

export async function GET() {
  try {
    console.log('GET request to /api/gemini');
    return NextResponse.json({ 
      success: true,
      hasApiKey: !!geminiApiKey
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST request to /api/gemini');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    if (body.action === 'setApiKey' && body.apiKey) {
      // Store the API key in memory
      geminiApiKey = body.apiKey;
      console.log('API key set successfully');
      
      return NextResponse.json({
        success: true,
        message: 'API key set successfully'
      });
    }
    
    if (body.action === 'generateUI' && body.request) {
      if (!geminiApiKey) {
        // Temporarily allow operation without API key and return mock data
        console.log('API key not set, returning mock data');
        return NextResponse.json({
          success: true,
          data: {
            jsx: '<div className="p-4 bg-blue-100 rounded-lg"><p className="text-blue-800">This is a mock component generated for testing</p></div>',
            explanation: 'This is a mock response for testing'
          }
        });
      }
      
      // Get the Gemini client
      const genAI = getGeminiClient();
      
      // Create the model
      const model = genAI?.getGenerativeModel({ model: "gemini-1.5-pro" });
      if (!model) {
        throw new Error('Failed to initialize Gemini model');
      }
      
      // Prepare prompts based on user request
      const { componentType, description, stylePreferences } = body.request;
      
      const prompt = `
Generate a React component using Tailwind CSS for the following:
- Component: ${componentType}
- Description: ${description}
${stylePreferences ? `- Style preferences: ${stylePreferences}` : ''}

Important guidelines:
1. Respond only with valid HTML/JSX and Tailwind CSS classes
2. Don't use any custom CSS, only Tailwind classes
3. Use modern design principles
4. Make sure all HTML attributes are properly quoted
5. For React, use className instead of class
6. Don't include any imports or export statements
7. Only include the component JSX, not a complete React component definition
8. Only use standard HTML elements and Tailwind classes
9. Make sure all brackets, quotes and tags are properly balanced
10. Don't wrap your response in code blocks or backticks

Example good output:
<div className="p-4 bg-blue-100 rounded-lg shadow hover:shadow-md transition-all">
  <h2 className="text-xl font-bold mb-2">Card Title</h2>
  <p className="text-gray-700">Card content goes here</p>
</div>
`;

      console.log('Sending prompt to Gemini:', prompt);
      
      try {
        // Generate content with Gemini
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log('Received response from Gemini:', text);
        
        // Clean up the text by removing any code block markup
        const cleanJsx = text.replace(/```(jsx|html|tsx|javascript|js)?\n?/g, '').replace(/```/g, '').trim();
        
        return NextResponse.json({
          success: true,
          data: {
            jsx: cleanJsx,
            explanation: `Generated ${componentType} component based on your description`
          }
        });
      } catch (geminiError) {
        console.error('Gemini API error:', geminiError);
        
        // Fallback to mock data in case of error
        return NextResponse.json({
          success: true,
          data: {
            jsx: '<div className="p-4 bg-red-100 rounded-lg"><p className="text-red-800">Failed to generate component with Gemini. Using fallback.</p></div>',
            explanation: 'Error: ' + (geminiError instanceof Error ? geminiError.message : 'Unknown error with Gemini API')
          }
        });
      }
    }
    
    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    }, { status: 400 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 
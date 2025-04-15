import { getGeminiClient, MODEL_NAME } from './gemini-config';

export interface UIGenerationRequest {
  componentType: string;
  description: string;
  props?: Record<string, any>;
  stylePreferences?: string;
}

export interface UIGenerationResponse {
  jsx: string;
  css?: string;
  explanation?: string;
}

export const generateUIComponent = async (request: UIGenerationRequest): Promise<UIGenerationResponse> => {
  const gemini = getGeminiClient();
  const model = gemini.getGenerativeModel({ model: MODEL_NAME });
  
  const prompt = `
Generate a React component based on the following requirements:
Component Type: ${request.componentType}
Description: ${request.description}
Props: ${JSON.stringify(request.props || {})}
Style Preferences: ${request.stylePreferences || 'Modern, clean design with Tailwind CSS'}

Respond only with valid JSX code that can be directly inserted into a React application.
Use Tailwind CSS for styling.
The component should be functional and self-contained.
Do not include import statements or React component declarations, just the JSX.
`;

  try {
    console.log('Sending request to Gemini API with prompt:', prompt);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Received response from Gemini API:', text);
    
    // Extract JSX code from the response
    const jsx = text.replace(/```(jsx|tsx|javascript|js|html)?([\s\S]*?)```/g, '$2').trim();
    
    return {
      jsx,
      explanation: 'UI component generated successfully'
    };
  } catch (error) {
    // Log the full error details
    console.error('Error details:', error);
    
    // Check if it's an API key error
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Invalid API key or API key not authorized for Gemini. Please check your API key.');
      }
      if (error.message.includes('quota')) {
        throw new Error('API quota exceeded. Please try again later.');
      }
      throw error;
    }
    
    throw new Error('Failed to generate UI component: Unknown error');
  }
}; 
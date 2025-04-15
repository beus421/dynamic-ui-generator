"use client";

import { GoogleGenerativeAI } from '@google/generative-ai';

// Use localStorage for client-side API key persistence
const STORAGE_KEY = 'gemini_api_key';
let apiKey = '';
let geminiClient: GoogleGenerativeAI | null = null;

// Initialize API key from localStorage if available
if (typeof window !== 'undefined') {
  const storedKey = localStorage.getItem(STORAGE_KEY);
  if (storedKey) {
    apiKey = storedKey;
    console.log('API key loaded from storage');
  }
}

export const setApiKey = (key: string) => {
  if (!key || typeof key !== 'string' || key.trim().length < 10) {
    throw new Error('Invalid API key format');
  }
  
  // Update the API key
  apiKey = key.trim();
  
  // Save to localStorage for persistence
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, apiKey);
  }
  
  // Reset the client so it will be recreated with the new key
  geminiClient = null;
  
  console.log('API key set successfully');
};

export const clearApiKey = () => {
  apiKey = '';
  geminiClient = null;
  
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  
  console.log('API key cleared');
};

export const getApiKey = () => apiKey;

export const getGeminiClient = () => {
  if (!apiKey) {
    throw new Error('Gemini API key is not set. Please set it first.');
  }
  
  // Create the client only once and reuse it
  if (!geminiClient) {
    try {
      console.log('Creating new Gemini client');
      geminiClient = new GoogleGenerativeAI(apiKey);
    } catch (error) {
      console.error('Failed to create Gemini client:', error);
      throw new Error('Failed to initialize Gemini client. Please check your API key.');
    }
  }
  
  return geminiClient;
};

// Test the API key by making a simple request
export const testApiKey = async (): Promise<boolean> => {
  if (!apiKey) return false;
  
  try {
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: MODEL_NAME });
    
    // Make a simple test request
    await model.generateContent('Hello');
    return true;
  } catch (error) {
    console.error('API key test failed:', error);
    return false;
  }
};

export const MODEL_NAME = 'gemini-pro'; 
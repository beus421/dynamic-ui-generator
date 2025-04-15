"use client";

import { useState, useEffect } from 'react';
import GeminiSetup from '@/components/GeminiSetup';
import UIGenerator from '@/components/UIGenerator';

export default function Home() {
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing API key on component mount
  useEffect(() => {
    const checkApiKeyStatus = async () => {
      try {
        const response = await fetch('/api/gemini');
        
        if (!response.ok) {
          throw new Error(`API endpoint error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setIsApiKeySet(data.hasApiKey);
        } else {
          console.error('API key status check failed:', data.message);
          setError('Failed to verify API key status');
        }
      } catch (error) {
        console.error('Error checking API key status:', error);
        setError(error instanceof Error ? error.message : 'Failed to connect to server');
      } finally {
        setInitialCheckDone(true);
      }
    };

    checkApiKeyStatus();
  }, []);

  return (
    <div className="flex flex-col min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Dynamic UI Generator with Gemini</h1>
      
      {error && (
        <div className="p-3 mb-6 bg-red-50 border border-red-200 rounded">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-600 underline"
          >
            Dismiss
          </button>
        </div>
      )}
      
      <div className="mb-8">
        <GeminiSetup 
          onApiKeySet={() => setIsApiKeySet(true)} 
          onApiKeyCleared={() => setIsApiKeySet(false)}
        />
      </div>

      <div className="p-4 bg-blue-100 rounded-lg"><p className="text-blue-800">This is a mock component generated for testing</p></div>
      
      {initialCheckDone && <UIGenerator isApiKeySet={isApiKeySet} />}
      
      <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>Powered by Google Gemini API and Next.js</p>
      </footer>
    </div>
  );
}

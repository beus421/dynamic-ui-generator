"use client";

import React, { useState, useEffect } from 'react';
import { clearApiKey } from '../lib/gemini-config';

interface GeminiSetupProps {
  onApiKeySet: () => void;
  onApiKeyCleared?: () => void;
}

const GeminiSetup: React.FC<GeminiSetupProps> = ({ 
  onApiKeySet,
  onApiKeyCleared = () => {} 
}) => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);
  const [testResponse, setTestResponse] = useState<string | null>(null);

  useEffect(() => {
    // Test the API endpoint
    const testAPI = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try the test endpoint first
        const response = await fetch('/api/gemini-test');
        
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }
        
        const data = await response.json();
        setTestResponse(JSON.stringify(data, null, 2));
        
        // If the test endpoint works, check if API key is already set
        if (data.success) {
          try {
            const keyResponse = await fetch('/api/gemini');
            
            if (!keyResponse.ok) {
              setError('Gemini API route is not working, but test route is');
              return;
            }
            
            const keyData = await keyResponse.json();
            setHasKey(keyData.hasApiKey);
            if (keyData.hasApiKey) {
              onApiKeySet();
            }
          } catch (err) {
            console.error('Error checking API key:', err);
            setError('Failed to check API key status. The test API works, but Gemini API has issues.');
          }
        }
      } catch (err) {
        console.error('Error testing API:', err);
        setError('Failed to connect to the API. Please check if the server is running.');
      } finally {
        setLoading(false);
      }
    };

    testAPI();
  }, [onApiKeySet]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation for API key format
    if (!apiKey.trim() || apiKey.trim().length < 10) {
      setError('Please enter a valid API key');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'setApiKey',
          apiKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setHasKey(true);
        onApiKeySet();
      } else {
        setError(data.message || 'Failed to set API key');
      }
    } catch (err) {
      console.error('Error saving API key:', err);
      setError(err instanceof Error ? err.message : 'Error saving API key');
    } finally {
      setLoading(false);
    }
  };

  const handleClearApiKey = () => {
    clearApiKey();
    setHasKey(false);
    onApiKeyCleared();
  };

  if (hasKey) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded mb-6">
        <p className="text-green-700">✓ Gemini API key is set</p>
        <div className="mt-2 flex gap-4">
          <button 
            className="text-sm text-green-600 underline"
            onClick={() => setHasKey(false)}
          >
            Change API key
          </button>
          <button 
            className="text-sm text-red-600 underline"
            onClick={handleClearApiKey}
          >
            Clear API key
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 border border-gray-200 rounded-lg shadow-sm mb-8">
      <h2 className="text-xl font-semibold mb-4">Set Your Gemini API Key</h2>
      
      {testResponse && (
        <div className="mb-6 bg-gray-200 p-4 border border-gray-200 rounded">
          <h3 className="font-medium mb-2 text-gray-700">Test API Response:</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto text-gray-800">
            {testResponse}
          </pre>
        </div>
      )}
      
      <div className="mb-6 bg-blue-50 p-4 border border-blue-100 rounded text-sm">
        <h3 className="font-medium mb-2 text-blue-700">How to get a Gemini API Key:</h3>
        <ol className="list-decimal list-inside space-y-1 text-blue-800">
          <li>Go to <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a></li>
          <li>Sign in with your Google account</li>
          <li>Click on "Get API key" in the top navigation</li>
          <li>Create a new API key or use an existing one</li>
          <li>Copy the API key and paste it below</li>
        </ol>
        <p className="mt-2 text-blue-600 italic">Make sure your API key has access to the Gemini Pro model</p>
      </div>
      
      <p className="text-gray-600 mb-4">
        To use dynamic UI generation, you need to provide your Gemini API key.
      </p>
      
      {error && (
        <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
            Gemini API Key
          </label>
          <input
            type="password"
            id="apiKey"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIza..."
            required
          />
          <p className="mt-1 text-xs text-gray-500">Starts with "AIza" and should be about 30-50 characters long</p>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Saving...' : 'Save API Key'}
        </button>
      </form>
    </div>
  );
};

export default GeminiSetup; 
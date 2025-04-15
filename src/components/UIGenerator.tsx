"use client";

import React, { useState } from 'react';
import DynamicComponent from './DynamicComponent';

interface UIGeneratorProps {
  isApiKeySet: boolean;
}

const UIGenerator: React.FC<UIGeneratorProps> = ({ isApiKeySet }) => {
  const [componentType, setComponentType] = useState('');
  const [description, setDescription] = useState('');
  const [stylePreferences, setStylePreferences] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedJSX, setGeneratedJSX] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isApiKeySet) {
      setError('Please set your Gemini API key first');
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
          action: 'generateUI',
          request: {
            componentType,
            description,
            stylePreferences,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data from API:', data);
      
      if (data.success && data.data?.jsx) {
        // Store the JSX
        setGeneratedJSX(data.data.jsx);
        console.log('Set generated JSX:', data.data.jsx);
      } else {
        setError(data.message || 'Failed to generate UI component');
      }
    } catch (err) {
      console.error('Error generating UI component:', err);
      setError(err instanceof Error ? err.message : 'Error generating UI component');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Generate Dynamic UI</h2>
        
        {!isApiKeySet && (
          <div className="p-3 mb-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-yellow-700">Please set your Gemini API key first</p>
          </div>
        )}

        {error && (
          <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="componentType" className="block text-sm font-medium text-gray-700 mb-1">
              Component Type
            </label>
            <input
              type="text"
              id="componentType"
              placeholder="e.g., Button, Card, Table"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={componentType}
              onChange={(e) => setComponentType(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              placeholder="Describe what the component should do and look like"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="stylePreferences" className="block text-sm font-medium text-gray-700 mb-1">
              Style Preferences (optional)
            </label>
            <input
              type="text"
              id="stylePreferences"
              placeholder="e.g., Colorful, Minimalist, Dark theme"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={stylePreferences}
              onChange={(e) => setStylePreferences(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !isApiKeySet}
            className={`px-4 py-2 rounded text-white ${
              loading || !isApiKeySet ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Generating...' : 'Generate Component'}
          </button>
        </form>
      </div>

      {generatedJSX && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Generated Component</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 bg-white">
              <DynamicComponent jsx={generatedJSX} />
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Generated JSX</h4>
              <pre className="p-3 bg-gray-100 rounded text-sm overflow-x-auto text-gray-800">
                {generatedJSX}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UIGenerator; 
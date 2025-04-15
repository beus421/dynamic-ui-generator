"use client";

import React, { useMemo } from 'react';
import { LiveProvider, LivePreview, LiveError } from 'react-live';

// Enhanced JSX parsing with react-live
export const parse = (jsxString: string): React.ReactNode => {
  // Include React in the scope
  const scope = {
    React
  };

  // Clean the JSX string - remove escape characters from quotes
  const cleanedJsxString = jsxString.replace(/\\"/g, '"');

  // For react-live to work properly, we need to have a complete component syntax
  // We'll wrap the HTML in a simple render expression
  const liveCode = `render(${cleanedJsxString})`;

  return (
    <LiveProvider code={liveCode} scope={scope} noInline={true}>
      <div className="relative">
        <LivePreview />
        <LiveError className="p-3 bg-red-50 text-red-700 mt-2 rounded text-sm" />
      </div>
    </LiveProvider>
  );
};

// Custom hook for parsing JSX safely on the client side
export const useJsxParser = (jsxString: string): {
  element: React.ReactNode;
  error: Error | null;
} => {
  return useMemo(() => {
    try {
      return {
        element: parse(jsxString),
        error: null
      };
    } catch (err) {
      console.error('Error parsing JSX:', err);
      return {
        element: null,
        error: err instanceof Error ? err : new Error('Unknown error parsing JSX')
      };
    }
  }, [jsxString]);
};

// For a real implementation, consider:
// 1. Using a package like react-live or react-jsx-parser
// 2. Using a secure sandboxed iframe approach
// 3. Using server-side generation of components 
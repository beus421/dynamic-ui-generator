"use client";

import React, { useState, useEffect } from 'react';
import { useJsxParser } from '../lib/jsx-parser';

interface DynamicComponentProps {
  jsx: string;
  fallback?: React.ReactNode;
}

const DynamicComponent: React.FC<DynamicComponentProps> = ({ 
  jsx, 
  fallback = <div className="p-4 border border-red-300 bg-red-50 rounded">Failed to render component</div> 
}) => {
  const [mounted, setMounted] = useState(false);
  const { element, error } = useJsxParser(jsx);

  // Only render on the client side to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render the component on the client side to avoid hydration mismatches
  if (!mounted) {
    return null; // Return nothing during SSR
  }

  // For debugging
  console.log("DynamicComponent received JSX:", jsx);
  console.log("JSX parsing result:", { element, error });

  // First try to render with the parsed JSX
  if (element && !error) {
    return <div className="dynamic-component-container">{element}</div>;
  }

  // If JSX parsing failed, try using dangerouslySetInnerHTML as fallback
  try {
    console.log("Falling back to dangerouslySetInnerHTML");
    
    // Process the JSX string to make it HTML-compatible
    let processedJsx = jsx;
    
    // 1. Remove escaped quotes
    processedJsx = processedJsx.replace(/\\"/g, '"');
    
    // 2. Remove JSX comments
    processedJsx = processedJsx.replace(/{\/\*.*?\*\/}/g, '');
    
    // 3. Convert className to class for HTML compatibility
    processedJsx = processedJsx.replace(/className=/g, 'class=');
    
    // 4. Handle self-closing tags that HTML doesn't support
    processedJsx = processedJsx.replace(/<(input|img|br|hr)([^>]*)\/>/g, '<$1$2>');
    
    // 5. Convert JSX boolean attributes to HTML format
    processedJsx = processedJsx.replace(/(\w+)={true}/g, '$1');
    processedJsx = processedJsx.replace(/(\w+)={false}/g, '');
    
    console.log("Processed JSX for HTML:", processedJsx);
    
    return (
      <div className="dynamic-component-container">
        <div dangerouslySetInnerHTML={{ __html: processedJsx }} />
      </div>
    );
  } catch (fallbackError) {
    console.error("Error rendering JSX with fallback method:", fallbackError);
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded">
        <p className="text-red-700 font-medium">Error rendering component</p>
        <p className="text-red-600">
          {error?.message || (fallbackError instanceof Error ? fallbackError.message : 'Unknown error')}
        </p>
      </div>
    );
  }
};

export default DynamicComponent; 
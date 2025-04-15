"use client";

import React from 'react';
import { uiRegistry, UIInstruction } from '../lib/uiRegistry';

interface DynamicRendererProps {
  instructions: UIInstruction[];
}

export function DynamicRenderer({ instructions }: DynamicRendererProps) {
  return (
    <div className="flex flex-col gap-4">
      {instructions.map((inst, i) => {
        const Component = uiRegistry[inst.component];
        if (!Component) {
          return <div key={i}>Unknown component "{inst.component}"</div>;
        }
        return <Component key={i} {...inst.props} />;
      })}
    </div>
  );
} 
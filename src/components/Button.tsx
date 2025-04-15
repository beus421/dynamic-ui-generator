"use client";

import React from 'react';

export interface ButtonProps {
  label: string;
  color: string;
}

export default function Button({ label, color }: ButtonProps) {
  return (
    <button
      className="px-4 py-2 rounded-md text-white"
      style={{ backgroundColor: color }}
    >
      {label}
    </button>
  );
} 
import React from 'react';

interface GradientHeadingProps {
  text: string;
  className?: string;
}

export function GradientHeading({ text, className = '' }: GradientHeadingProps) {
  return (
    <h1 
      className={`text-4xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent ${className}`}
    >
      {text}
    </h1>
  );
} 
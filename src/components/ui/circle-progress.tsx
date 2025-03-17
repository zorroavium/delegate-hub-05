
import React from 'react';
import { cn } from '@/lib/utils';

interface CircleProgressProps {
  value: number;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const CircleProgress: React.FC<CircleProgressProps> = ({ 
  value, 
  size = 'medium', 
  className 
}) => {
  // Calculate sizes based on the size prop
  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'w-8 h-8';
      case 'large': return 'w-16 h-16';
      default: return 'w-12 h-12';
    }
  };

  const getTextSizeClass = () => {
    switch (size) {
      case 'small': return 'text-xs';
      case 'large': return 'text-lg';
      default: return 'text-sm';
    }
  };

  // Calculate circle properties
  const radius = size === 'small' ? 12 : size === 'large' ? 30 : 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', getSizeClass(), className)}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
        {/* Background circle */}
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth="4"
          className="opacity-10"
        />
        {/* Progress circle */}
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      <div className={cn('absolute inset-0 flex items-center justify-center', getTextSizeClass())}>
        {value}%
      </div>
    </div>
  );
};

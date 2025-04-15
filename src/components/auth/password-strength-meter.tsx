
import React from 'react';

interface PasswordStrengthMeterProps {
  strength: number;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ strength }) => {
  const getColorClass = () => {
    if (strength < 20) return 'bg-red-500';
    if (strength < 40) return 'bg-orange-500';
    if (strength < 60) return 'bg-yellow-500';
    if (strength < 80) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (strength < 20) return 'Very Weak';
    if (strength < 40) return 'Weak';
    if (strength < 60) return 'Medium';
    if (strength < 80) return 'Strong';
    return 'Very Strong';
  };

  return (
    <div className="w-full space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Password strength:</span>
        <span className={`text-xs font-medium ${getColorClass().replace('bg-', 'text-')}`}>
          {getStrengthText()}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div 
          className={`h-full rounded-full ${getColorClass()} transition-all duration-300`} 
          style={{ width: `${strength}%` }}
        ></div>
      </div>
    </div>
  );
};

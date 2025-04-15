
import React from 'react';
import { Check, X, AlertTriangle, Info } from 'lucide-react';

interface PasswordStrengthMeterProps {
  strength: number;
  password?: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ strength, password }) => {
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

  const getPasswordFeedback = () => {
    if (!password) return null;
    
    const checks = [
      { 
        passed: password.length >= 8, 
        text: 'At least 8 characters',
        icon: password.length >= 8 ? Check : X
      },
      { 
        passed: /[A-Z]/.test(password), 
        text: 'Contains uppercase letter',
        icon: /[A-Z]/.test(password) ? Check : X
      },
      { 
        passed: /[a-z]/.test(password), 
        text: 'Contains lowercase letter',
        icon: /[a-z]/.test(password) ? Check : X
      },
      { 
        passed: /[0-9]/.test(password), 
        text: 'Contains number',
        icon: /[0-9]/.test(password) ? Check : X
      },
      { 
        passed: /[^A-Za-z0-9]/.test(password), 
        text: 'Contains special character',
        icon: /[^A-Za-z0-9]/.test(password) ? Check : X
      }
    ];
    
    return (
      <div className="mt-2 space-y-1.5 text-sm">
        {checks.map((check, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className={`p-0.5 rounded-full ${check.passed ? 'text-green-500' : 'text-red-500'}`}>
              <check.icon className="h-3.5 w-3.5" />
            </span>
            <span className={`text-xs ${check.passed ? 'text-muted-foreground' : 'text-red-500'}`}>{check.text}</span>
          </div>
        ))}
      </div>
    );
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
      
      {password && getPasswordFeedback()}
      
      {strength < 40 && password && (
        <div className="mt-2 flex items-start gap-2 text-amber-600 dark:text-amber-500">
          <AlertTriangle className="h-4 w-4 mt-0.5" />
          <p className="text-xs">Using a weak password increases security risks. Consider using a stronger password.</p>
        </div>
      )}
      
      {strength >= 80 && password && (
        <div className="mt-2 flex items-start gap-2 text-green-600 dark:text-green-500">
          <Info className="h-4 w-4 mt-0.5" />
          <p className="text-xs">Great! This password provides good protection.</p>
        </div>
      )}
    </div>
  );
};

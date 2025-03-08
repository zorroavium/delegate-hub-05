
import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  change?: number;
  changeText?: string;
  className?: string;
  onClick?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
  change,
  changeText,
  className,
  onClick,
}) => {
  const isPositiveChange = change !== undefined && change >= 0;

  return (
    <div
      onClick={onClick}
      className={cn(
        'glass-card p-6 transition-all duration-300 ease-in-out',
        onClick && 'cursor-pointer hover:translate-y-[-4px]',
        className
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
          
          {change !== undefined && (
            <div className="flex items-center mt-2">
              <div 
                className={cn(
                  "flex items-center text-xs font-medium rounded-full px-2 py-0.5",
                  isPositiveChange 
                    ? "text-status-completed bg-status-completed/10" 
                    : "text-status-delayed bg-status-delayed/10"
                )}
              >
                {isPositiveChange ? (
                  <ArrowUpRight size={14} className="mr-1" />
                ) : (
                  <ArrowDownRight size={14} className="mr-1" />
                )}
                {Math.abs(change)}%
              </div>
              {changeText && <span className="text-xs text-muted-foreground ml-2">{changeText}</span>}
            </div>
          )}
        </div>
        
        <div className="p-3 rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
};

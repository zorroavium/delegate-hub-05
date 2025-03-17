
import React from 'react';
import { Bar } from 'recharts';

interface ClickableBarProps {
  dataKey: string;
  fill?: string;
  name?: string;
  onClick?: (data: any) => void;
  [key: string]: any;
}

export const ClickableBar: React.FC<ClickableBarProps> = ({ 
  dataKey, 
  fill, 
  name, 
  onClick,
  ...props 
}) => {
  const handleClick = (data: any) => {
    // Ensure payload data has proper name formatting
    const payload = data.payload;
    
    // Dispatch custom event with payload data
    const event = new CustomEvent('chart-click', {
      detail: {
        payload,
        dataKey
      }
    });
    document.dispatchEvent(event);
    
    // Also call the original onClick if provided
    if (onClick) {
      onClick(data);
    }
  };
  
  return (
    <Bar 
      dataKey={dataKey} 
      fill={fill} 
      name={name} 
      onClick={handleClick}
      cursor="pointer"
      {...props}
    />
  );
};

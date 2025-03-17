
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ChartNavigationProps {
  children: React.ReactNode;
}

export const ChartNavigation: React.FC<ChartNavigationProps> = ({ children }) => {
  const navigate = useNavigate();
  
  const handleChartClick = (event: CustomEvent) => {
    const { payload, dataKey } = event.detail;
    
    if (dataKey === 'tasks' && payload && payload.name) {
      // Convert chart label to status ID (e.g. "In Progress" -> "in-progress")
      const statusId = payload.name.toLowerCase().replace(' ', '-');
      navigate(`/tasks?status=${statusId}`);
    }
    
    if (dataKey === 'completionRate' && payload && payload.name) {
      // Navigate to tasks filtered by department
      navigate(`/tasks?department=${payload.name}`);
    }
  };
  
  React.useEffect(() => {
    // Listen for custom event from chart components
    document.addEventListener('chart-click', handleChartClick as EventListener);
    
    return () => {
      document.removeEventListener('chart-click', handleChartClick as EventListener);
    };
  }, []);
  
  return <>{children}</>;
};

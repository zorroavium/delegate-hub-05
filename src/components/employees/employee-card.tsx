
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmployeeProfile, Employee } from '@/components/employees/employee-profile';
import { useNavigate } from 'react-router-dom';
import { useTaskStore } from '@/store/useTaskStore';
import { useStatusStore } from '@/store/useStatusStore';
import { Progress } from '@/components/ui/progress';

interface EmployeeCardProps {
  employee: Employee;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { tasks } = useTaskStore();
  const { statuses } = useStatusStore();
  
  // Get employee tasks
  const employeeTasks = tasks.filter(task => task.assignee.id === employee.id);
  
  // Count tasks by status
  const getTaskCountByStatus = () => {
    const statusCounts: Record<string, number> = {};
    
    // Initialize counts for all statuses
    statuses.forEach(status => {
      statusCounts[status.id] = 0;
    });
    
    // Count tasks
    employeeTasks.forEach(task => {
      if (statusCounts[task.status] !== undefined) {
        statusCounts[task.status]++;
      }
    });
    
    return statusCounts;
  };
  
  const taskCountByStatus = getTaskCountByStatus();
  
  // Calculate completion percentage
  const completedTasks = employeeTasks.filter(task => task.status === 'completed').length;
  const completionPercentage = employeeTasks.length > 0 
    ? Math.round((completedTasks / employeeTasks.length) * 100) 
    : 0;
    
  // Handle status click to navigate to filtered tasks
  const handleStatusClick = (status: string) => {
    navigate(`/tasks?status=${status}&employee=${employee.id}`);
  };
  
  // Get status badge style
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/30';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800/30';
      case 'on-leave':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/30';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };
  
  return (
    <>
      <Card className="h-full hover:shadow-md transition-shadow duration-300 relative flex flex-col">
        {/* Employee status badge in top-right - improved styling */}
        <div className="absolute top-3 right-3 z-10">
          <Badge 
            variant="outline"
            className={`px-2.5 py-1 font-medium text-xs rounded-full ${getStatusBadgeStyle(employee.status)}`}
          >
            {employee.status === 'on-leave' ? 'On Leave' : employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
          </Badge>
        </div>
        
        <CardContent className="p-5 flex-1 flex flex-col">
          {/* Employee header - improved spacing */}
          <div className="flex items-center gap-4 mb-5">
            <Avatar className={`h-12 w-12 ${employee.color || 'bg-primary'}`}>
              <div className="flex items-center justify-center w-full h-full text-white font-medium">
                {employee.avatar || employee.name.split(' ').map(n => n[0]).join('')}
              </div>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg leading-tight">{employee.name}</h3>
              <p className="text-sm text-muted-foreground">{employee.role}</p>
            </div>
          </div>
          
          {/* Employee details - improved spacing and alignment */}
          <div className="space-y-2.5 mb-5">
            <div className="flex items-center gap-2 text-sm">
              <Mail size={15} className="text-muted-foreground shrink-0" />
              <a href={`mailto:${employee.email}`} className="text-primary hover:underline truncate">
                {employee.email}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone size={15} className="text-muted-foreground shrink-0" />
              <span>{employee.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={15} className="text-muted-foreground shrink-0" />
              <span>{employee.location}</span>
            </div>
          </div>
          
          {/* Task statistics */}
          <div className="border-t pt-4 mt-auto">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium">Task Completion</span>
              <span className="text-sm font-medium">{completionPercentage}%</span>
            </div>
            <Progress 
              value={completionPercentage} 
              className="h-2 mb-4" 
              indicatorClassName={completionPercentage === 100 ? "bg-status-completed" : undefined} 
            />
            
            {/* Status buttons - improved layout with grid for consistent sizing */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleStatusClick('pending')}
                className="flex flex-col items-center justify-center py-2 px-1 bg-blue-50 dark:bg-blue-900/20 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors h-full"
              >
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1 whitespace-nowrap">Pending</span>
                <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
                  {taskCountByStatus['pending'] || 0}
                </span>
              </button>
              
              <button
                onClick={() => handleStatusClick('in-progress')}
                className="flex flex-col items-center justify-center py-2 px-1 bg-amber-50 dark:bg-amber-900/20 rounded-md hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors h-full"
              >
                <span className="text-xs font-medium text-amber-700 dark:text-amber-300 mb-1 whitespace-nowrap">In Progress</span>
                <span className="text-lg font-bold text-amber-700 dark:text-amber-300">
                  {taskCountByStatus['in-progress'] || 0}
                </span>
              </button>
              
              <button
                onClick={() => handleStatusClick('completed')}
                className="flex flex-col items-center justify-center py-2 px-1 bg-green-50 dark:bg-green-900/20 rounded-md hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors h-full"
              >
                <span className="text-xs font-medium text-green-700 dark:text-green-300 mb-1 whitespace-nowrap">Completed</span>
                <span className="text-lg font-bold text-green-700 dark:text-green-300">
                  {taskCountByStatus['completed'] || 0}
                </span>
              </button>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsProfileOpen(true)} className="w-full">
              View Profile
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <EmployeeProfile 
        employee={employee} 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </>
  );
};

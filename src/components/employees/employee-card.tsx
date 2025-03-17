
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
  
  // Status colors
  const statusColors: Record<string, string> = {};
  statuses.forEach(status => {
    statusColors[status.id] = status.color;
  });
  
  return (
    <>
      <Card className="h-full hover:shadow-md transition-shadow duration-300 relative">
        {/* Employee status badge in top-right */}
        <div className="absolute top-2 right-2">
          <Badge className={
            employee.status === 'active' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
              : employee.status === 'inactive'
              ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
          }>
            {employee.status === 'on-leave' ? 'On Leave' : employee.status}
          </Badge>
        </div>
        
        <CardContent className="p-5">
          {/* Employee header */}
          <div className="flex items-center gap-4 mb-4">
            <Avatar className={`h-12 w-12 ${employee.color || 'bg-primary'}`}>
              <div className="flex items-center justify-center w-full h-full text-white">
                {employee.avatar || employee.name.split(' ').map(n => n[0]).join('')}
              </div>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{employee.name}</h3>
              <p className="text-sm text-muted-foreground">{employee.role}</p>
            </div>
          </div>
          
          {/* Employee details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Mail size={14} className="text-muted-foreground" />
              <a href={`mailto:${employee.email}`} className="text-primary hover:underline truncate">
                {employee.email}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone size={14} className="text-muted-foreground" />
              <span>{employee.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={14} className="text-muted-foreground" />
              <span>{employee.location}</span>
            </div>
          </div>
          
          {/* Task statistics */}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium">Task Completion</span>
              <span className="text-sm font-medium">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2 mb-3" 
              indicatorClassName={completionPercentage === 100 ? "bg-status-completed" : undefined} />
            
            <div className="flex flex-wrap gap-2 mt-4">
              {/* Only show statuses with tasks, sorted by order */}
              {statuses
                .sort((a, b) => a.order - b.order)
                .map(status => {
                  const count = taskCountByStatus[status.id] || 0;
                  if (count === 0) return null;
                  
                  return (
                    <button
                      key={status.id}
                      onClick={() => handleStatusClick(status.id)}
                      className="flex items-center gap-1 px-2 py-1 rounded-md bg-accent/20 hover:bg-accent/40 transition-colors text-xs"
                    >
                      <div className={`w-2 h-2 rounded-full ${status.color}`}></div>
                      <span>{status.name}: {count}</span>
                    </button>
                  );
                })}
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

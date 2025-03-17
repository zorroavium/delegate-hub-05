
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Calendar, Clock, MoreHorizontal, AlertTriangle, UserX } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/store/useTaskStore';
import { Progress } from '@/components/ui/progress';
import { getStatusClassName, getTaskPriorityClass } from '@/services/taskService';

interface EnhancedTaskCardProps {
  task: Task;
  className?: string;
}

export const EnhancedTaskCard: React.FC<EnhancedTaskCardProps> = ({ task, className }) => {
  // Get status class for the border
  const getStatusClass = () => {
    switch (task.status) {
      case 'pending':
        return 'border-l-status-pending';
      case 'in-progress':
        return 'border-l-status-in-progress';
      case 'completed':
        return 'border-l-status-completed';
      case 'delayed':
        return 'border-l-status-delayed';
      default:
        return 'border-l-gray-300';
    }
  };

  // Format date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Check if task is past due date
  const isPastDue = () => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return dueDate < today && task.status !== 'completed';
  };

  // Check if task is unassigned
  const isUnassigned = () => {
    return !task.assignee || !task.assignee.id || task.assignee.id === 'unassigned';
  };

  return (
    <Link
      to={`/task/${task.id}`}
      className={cn(
        'block bg-card hover:bg-accent/5 rounded-lg border border-l-4 shadow-sm transition-all duration-300 hover:shadow-md max-w-md mx-auto lg:mx-0',
        getStatusClass(),
        className
      )}
    >
      <Card className="border-0 shadow-none">
        <CardContent className="p-4 space-y-3">
          {/* Task title and actions */}
          <div className="flex items-start justify-between">
            <h3 className="font-medium text-balance line-clamp-2">{task.title}</h3>
            <div className="flex items-center">
              <button className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>

          {/* Unassigned ribbon or progress bar */}
          <div className="flex justify-between items-center">
            {isUnassigned() ? (
              <div className="flex items-center">
                <div className="relative">
                  <Badge 
                    variant="outline" 
                    className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 flex items-center gap-1.5 border-gray-300"
                  >
                    <UserX size={14} />
                    Unassigned
                  </Badge>
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-medium px-1.5 rounded-full">
                    NEW
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex-1 max-w-24">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium">{task.progress}%</span>
                  </div>
                  <Progress 
                    value={task.progress} 
                    className="h-2"
                    indicatorClassName={task.status === 'completed' ? 'bg-status-completed' : undefined}
                  />
                </div>
                <Avatar className="h-8 w-8 border border-border flex items-center justify-center">
                  <div className="flex items-center justify-center w-full h-full text-xs font-medium bg-primary text-primary-foreground">
                    {task.assignee.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </Avatar>
              </div>
            )}

            {/* Priority badge */}
            <div className="flex items-center">
              <div className={cn(
                "py-0.5 px-2.5 text-xs font-medium rounded",
                getTaskPriorityClass(task.priority)
              )}>
                {task.priority === 'high' && <AlertTriangle size={12} className="inline mr-1 text-red-600 dark:text-red-400" />}
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </div>
            </div>
          </div>

          {/* Footer with metadata */}
          <div className="flex items-center justify-between pt-2 border-t border-border/30">
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar size={14} className="mr-1" />
              <span className={cn(
                isPastDue() && 'text-status-delayed font-medium flex items-center gap-1',
              )}>
                {formatDate(task.dueDate)}
                {isPastDue() && <AlertTriangle size={12} />}
              </span>
            </div>

            {/* Status badge */}
            <Badge 
              variant="outline"
              className={cn(
                'font-medium text-xs px-2 py-0.5',
                getStatusClassName(task.status)
              )}
            >
              {task.status.replace('-', ' ')}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

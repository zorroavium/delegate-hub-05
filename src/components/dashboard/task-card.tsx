
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Calendar, Clock, MoreHorizontal, AlertTriangle, CheckCircle, Clock3 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Task } from '@/store/useTaskStore';
import { Badge } from '@/components/ui/badge';

interface TaskCardProps {
  task: Task;
  className?: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, className }) => {
  // Get priority class
  const getPriorityClass = () => {
    switch (task.priority) {
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'medium':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'low':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

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

  // Get progress status icon
  const getProgressIcon = () => {
    if (task.status === 'completed') {
      return <CheckCircle size={14} className="text-green-500" />;
    } else if (isPastDue()) {
      return <AlertTriangle size={14} className="text-red-500" />;
    } else if (task.progress > 0) {
      return <Clock3 size={14} className="text-amber-500" />;
    }
    return null;
  };

  return (
    <Link
      to={`/task/${task.id}`}
      className={cn(
        'block bg-card hover:bg-accent/5 rounded-lg border border-l-4 shadow-sm p-4 transition-all duration-300 hover:shadow-md max-w-md mx-auto lg:mx-0',
        getStatusClass(),
        className
      )}
    >
      <div className="space-y-3">
        {/* Priority badge - top right */}
        <div className="flex justify-end mb-1">
          <Badge 
            variant="outline" 
            className={cn(
              'text-xs px-2 py-0.5 font-medium rounded-full',
              getPriorityClass()
            )}
          >
            {task.priority === 'high' && <AlertTriangle size={12} className="mr-1 inline" />}
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>
        </div>

        {/* Task title */}
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-balance line-clamp-2">{task.title}</h3>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {task.description}
        </p>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs items-center">
            <span className="flex items-center gap-1">
              {getProgressIcon()}
              Progress
            </span>
            <span className="font-medium">{task.progress}%</span>
          </div>
          <Progress 
            value={task.progress} 
            className="h-1.5" 
            indicatorClassName={task.status === 'completed' ? 'bg-green-500' : undefined}
          />
        </div>

        {/* Footer with metadata */}
        <div className="flex items-center justify-between pt-2 mt-2 border-t border-border/30">
          {/* Due date */}
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar size={14} className="mr-1" />
            <span className={cn(
              isPastDue() && 'text-status-delayed font-medium flex items-center gap-1',
            )}>
              {formatDate(task.dueDate)}
              {isPastDue() && <AlertTriangle size={12} />}
            </span>
          </div>

          {/* Assignee */}
          <Avatar className={`h-7 w-7 border border-border ${task.assignee.color || 'bg-primary'}`}>
            <div className="flex items-center justify-center w-full h-full text-xs font-medium text-white">
              {task.assignee.avatar || task.assignee.name.split(' ').map(n => n[0]).join('')}
            </div>
          </Avatar>
        </div>
      </div>
    </Link>
  );
};

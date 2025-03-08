
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Calendar, Clock, MoreHorizontal, AlertTriangle } from 'lucide-react';
import { type Task } from './kanban-board';
import { Progress } from '@/components/ui/progress';

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

  return (
    <Link
      to={`/task/${task.id}`}
      className={cn(
        'block bg-card hover:bg-accent/5 rounded-lg border border-l-4 shadow-sm p-4 transition-all duration-300 hover:shadow-md',
        getStatusClass(),
        className
      )}
    >
      <div className="space-y-3">
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

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Progress</span>
            <span>{task.progress}%</span>
          </div>
          <Progress value={task.progress} className="h-1.5" />
        </div>

        {/* Footer with metadata */}
        <div className="flex items-center justify-between">
          {/* Priority and date */}
          <div className="flex items-center space-x-2">
            <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', getPriorityClass())}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
            
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar size={14} className="mr-1" />
              <span className={cn(
                isPastDue() && 'text-status-delayed font-medium flex items-center gap-1',
              )}>
                {formatDate(task.dueDate)}
                {isPastDue() && <AlertTriangle size={12} />}
              </span>
            </div>
          </div>

          {/* Assignee */}
          <Avatar className="h-6 w-6 border border-border">
            <div className="bg-primary text-primary-foreground flex items-center justify-center w-full h-full text-xs font-medium">
              {task.assignee.name.split(' ').map(n => n[0]).join('')}
            </div>
          </Avatar>
        </div>
      </div>
    </Link>
  );
};

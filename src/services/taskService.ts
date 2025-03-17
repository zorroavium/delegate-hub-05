
import { Task } from '@/store/useTaskStore';

// Service for task-related data and utilities

export const getStatusClassName = (status: string): string => {
  switch (status) {
    case 'pending':
    case 'todo':
      return 'bg-status-pending text-status-pending-foreground';
    case 'in-progress':
    case 'in_progress':
      return 'bg-status-in-progress text-status-in-progress-foreground';
    case 'completed':
      return 'bg-status-completed text-status-completed-foreground';
    case 'delayed':
      return 'bg-status-delayed text-status-delayed-foreground';
    case 'review':
      return 'bg-purple-500 text-white';
    case 'approved':
      return 'bg-blue-500 text-white';
    default:
      return 'bg-gray-300 text-gray-800';
  }
};

export const getTaskPriorityClass = (priority: string): string => {
  switch (priority) {
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

export const calculateCompletionRate = (tasks: Task[]): number => {
  if (tasks.length === 0) return 0;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  return Math.round((completedTasks / tasks.length) * 100);
};

export const getTasksCountByStatus = (tasks: Task[]): Record<string, number> => {
  return tasks.reduce((acc, task) => {
    const status = task.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

export const getTasksCountByPriority = (tasks: Task[]): Record<string, number> => {
  return tasks.reduce((acc, task) => {
    const priority = task.priority;
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

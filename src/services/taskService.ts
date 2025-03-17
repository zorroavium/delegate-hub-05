import { Task } from '@/store/useTaskStore';

// Service for task-related data and utilities

export const getStatusClassName = (status: string): string => {
  switch (status) {
    case 'pending':
    case 'todo':
      return 'bg-status-pending/15 text-status-pending border-status-pending';
    case 'in-progress':
    case 'in_progress':
      return 'bg-status-in-progress/15 text-status-in-progress border-status-in-progress';
    case 'completed':
      return 'bg-status-completed/15 text-status-completed border-status-completed';
    case 'delayed':
      return 'bg-status-delayed/15 text-status-delayed border-status-delayed';
    case 'review':
      return 'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-700';
    case 'approved':
      return 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600';
  }
};

export const getTaskPriorityClass = (priority: string): string => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700';
    case 'medium':
      return 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700';
    case 'low':
      return 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-600';
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

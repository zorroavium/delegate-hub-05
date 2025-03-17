
import React from 'react';
import { Task } from '@/store/useTaskStore';
import { EnhancedTaskCard } from '@/components/tasks/enhanced-task-card';

interface TaskListProps {
  tasks: Task[];
  emptyMessage?: string;
}

export const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  emptyMessage = "No tasks found."
}) => {
  if (tasks.length === 0) {
    return (
      <div className="col-span-full py-12 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map(task => (
        <div key={task.id} className="h-full">
          <EnhancedTaskCard task={task} className="h-full" />
        </div>
      ))}
    </div>
  );
};

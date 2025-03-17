
import React from 'react';
import { Task } from '@/store/useTaskStore';
import { EnhancedTaskCard } from '@/components/tasks/enhanced-task-card';
import { Grid } from '@/components/ui/grid';

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
    <Grid columns={{ default: 1, sm: 2, lg: 3 }} gap={6}>
      {tasks.map(task => (
        <div key={task.id} className="w-full h-full">
          <EnhancedTaskCard task={task} className="h-full" />
        </div>
      ))}
    </Grid>
  );
};

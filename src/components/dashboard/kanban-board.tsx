
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { TaskCard } from './task-card';
import { Plus } from 'lucide-react';
import { CustomButton } from '../ui/custom-button';

// Task type definition
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  progress: number;
  assignee: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  status: Task['status'];
  onAddTask?: () => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, tasks, status, onAddTask }) => {
  // Get status color
  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'border-status-pending/30 bg-status-pending/5';
      case 'in-progress':
        return 'border-status-in-progress/30 bg-status-in-progress/5';
      case 'completed':
        return 'border-status-completed/30 bg-status-completed/5';
      case 'delayed':
        return 'border-status-delayed/30 bg-status-delayed/5';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div 
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border shadow-sm transition-all duration-300',
        getStatusColor()
      )}
    >
      {/* Column header */}
      <div className="p-3 font-medium border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div 
            className={cn(
              "w-2.5 h-2.5 rounded-full",
              status === 'pending' && "bg-status-pending",
              status === 'in-progress' && "bg-status-in-progress",
              status === 'completed' && "bg-status-completed",
              status === 'delayed' && "bg-status-delayed",
            )}
          />
          <span>{title}</span>
          <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-normal rounded-full px-2">
            {tasks.length}
          </span>
        </div>
        {onAddTask && (
          <button 
            onClick={onAddTask}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <Plus size={18} />
          </button>
        )}
      </div>
      
      {/* Tasks */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[400px]">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        
        {tasks.length === 0 && (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            <p className="text-center">No tasks</p>
          </div>
        )}
      </div>
      
      {/* Add task button at bottom */}
      {onAddTask && (
        <div className="p-3 border-t">
          <CustomButton
            variant="ghost"
            size="sm"
            fullWidth
            icon={<Plus size={16} />}
            onClick={onAddTask}
            className="text-gray-500 justify-center"
          >
            Add Task
          </CustomButton>
        </div>
      )}
    </div>
  );
};

interface KanbanBoardProps {
  className?: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ className }) => {
  // Sample data
  const [tasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Update website content',
      description: 'Update the company website with new product information',
      status: 'pending',
      priority: 'high',
      dueDate: '2023-06-15',
      progress: 0,
      assignee: {
        id: '101',
        name: 'Sarah Johnson',
      },
    },
    {
      id: '2',
      title: 'Prepare quarterly report',
      description: 'Compile data and prepare the Q2 financial report',
      status: 'in-progress',
      priority: 'medium',
      dueDate: '2023-06-20',
      progress: 60,
      assignee: {
        id: '102',
        name: 'Mike Chen',
      },
    },
    {
      id: '3',
      title: 'Client meeting preparation',
      description: 'Prepare presentation and materials for client meeting',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2023-06-10',
      progress: 30,
      assignee: {
        id: '103',
        name: 'Jennifer Lee',
      },
    },
    {
      id: '4',
      title: 'Update social media strategy',
      description: 'Revise the social media content calendar for next month',
      status: 'completed',
      priority: 'low',
      dueDate: '2023-06-05',
      progress: 100,
      assignee: {
        id: '104',
        name: 'Alex Wong',
      },
    },
    {
      id: '5',
      title: 'Review new design mockups',
      description: 'Review and provide feedback on new design mockups',
      status: 'delayed',
      priority: 'medium',
      dueDate: '2023-06-01',
      progress: 20,
      assignee: {
        id: '105',
        name: 'Emily Davis',
      },
    },
    {
      id: '6',
      title: 'Finalize budget for Q3',
      description: 'Complete budget planning for the next quarter',
      status: 'pending',
      priority: 'high',
      dueDate: '2023-06-25',
      progress: 0,
      assignee: {
        id: '106',
        name: 'Robert Miller',
      },
    },
  ]);

  // Group tasks by status
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const delayedTasks = tasks.filter(task => task.status === 'delayed');

  const handleAddTask = () => {
    console.log('Add new task');
    // Would handle task creation in a real app
  };

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
      <KanbanColumn 
        title="Pending" 
        tasks={pendingTasks} 
        status="pending"
        onAddTask={handleAddTask}
      />
      <KanbanColumn 
        title="In Progress" 
        tasks={inProgressTasks} 
        status="in-progress"
        onAddTask={handleAddTask}
      />
      <KanbanColumn 
        title="Completed" 
        tasks={completedTasks} 
        status="completed"
      />
      <KanbanColumn 
        title="Delayed" 
        tasks={delayedTasks} 
        status="delayed"
        onAddTask={handleAddTask}
      />
    </div>
  );
};

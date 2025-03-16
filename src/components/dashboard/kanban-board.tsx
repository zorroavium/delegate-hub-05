
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { TaskCard } from './task-card';
import { Plus } from 'lucide-react';
import { CustomButton } from '../ui/custom-button';
import { CreateTaskDialog } from '../tasks/create-task-dialog';
import { useToast } from '@/hooks/use-toast';
import { useStatusStore } from '@/store/useStatusStore';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

// Task type definition
export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
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
  status: string;
  statusColor: string;
  onAddTask?: () => void;
  droppableId: string;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  title, 
  tasks, 
  status, 
  statusColor, 
  onAddTask,
  droppableId
}) => {
  // Get status color class from statusColor prop
  const getStatusColor = () => {
    const baseColor = statusColor.replace('bg-', '');
    return `border-${baseColor}/30 bg-${baseColor}/5`;
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
          <div className={cn("w-2.5 h-2.5 rounded-full", statusColor)} />
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
      
      {/* Tasks - Droppable container */}
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div 
            className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[400px]"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskCard task={task} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            
            {tasks.length === 0 && (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                <p className="text-center">No tasks</p>
              </div>
            )}
          </div>
        )}
      </Droppable>
      
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
  const { toast } = useToast();
  const { statuses } = useStatusStore();
  
  // Sample data
  const [tasks, setTasks] = useState<Task[]>([
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

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState<string>('pending');

  // Sort statuses by order
  const sortedStatuses = [...statuses].sort((a, b) => a.order - b.order);

  // Group tasks by status
  const getTasksByStatus = (statusId: string) => {
    return tasks.filter(task => task.status === statusId);
  };

  // Handle opening the task creation dialog with pre-selected status
  const handleAddTask = (status: string) => {
    setNewTaskStatus(status);
    setIsCreateDialogOpen(true);
  };

  // Handle the task creation from dialog
  const handleTaskCreated = (newTask: any) => {
    // Override the status with the one selected when clicking the Add Task button
    const taskWithStatus = {
      ...newTask,
      status: newTaskStatus
    };
    
    setTasks(prevTasks => [taskWithStatus, ...prevTasks]);
    toast({
      title: "Task Created",
      description: `"${newTask.title}" has been created successfully.`
    });
  };

  // Handle drag and drop
  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    
    // Dropped outside a droppable area
    if (!destination) return;
    
    // Check if the task is being moved between columns or within the same column
    if (source.droppableId !== destination.droppableId) {
      // Moving between columns (change status)
      const taskId = result.draggableId;
      const newStatus = destination.droppableId;
      
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
      
      // Show toast notification
      const task = tasks.find(t => t.id === taskId);
      const statusName = statuses.find(s => s.id === newStatus)?.name;
      
      if (task && statusName) {
        toast({
          title: `Task Status Updated`,
          description: `"${task.title}" has been moved to ${statusName}`
        });
      }
    } else if (source.index !== destination.index) {
      // Reordering within same column - we could implement this if needed
      // For now, we'll just leave the tasks in their current order
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
          {sortedStatuses.map((status) => (
            <KanbanColumn 
              key={status.id}
              title={status.name} 
              tasks={getTasksByStatus(status.id)} 
              status={status.id}
              statusColor={status.color}
              droppableId={status.id}
              onAddTask={() => handleAddTask(status.id)}
            />
          ))}
        </div>
      </DragDropContext>
      
      {/* Task Creation Dialog */}
      <CreateTaskDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onTaskCreated={handleTaskCreated}
      />
    </>
  );
};

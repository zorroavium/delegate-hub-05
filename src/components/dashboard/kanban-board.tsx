
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { TaskCard } from './task-card';
import { Plus } from 'lucide-react';
import { CustomButton } from '../ui/custom-button';
import { CreateTaskDialog } from '../tasks/create-task-dialog';
import { useToast } from '@/hooks/use-toast';
import { useStatusStore } from '@/store/useStatusStore';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useTaskStore, Task } from '@/store/useTaskStore';

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
            type="button"
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
            type="button"
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
  const { tasks, updateTask, addTask } = useTaskStore();
  
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
    // Add activity to the task
    const taskWithActivity = {
      ...newTask,
      status: newTaskStatus,
      activities: [
        {
          id: Date.now().toString(),
          userId: newTask.assignee.id,
          userName: newTask.assignee.name,
          userAvatar: newTask.assignee.avatar || newTask.assignee.name.split(' ').map((n: string) => n[0]).join(''),
          action: 'created this task',
          timestamp: new Date().toISOString(),
        }
      ]
    };
    
    addTask(taskWithActivity);
    
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
      
      // Find the task to update
      const task = tasks.find(t => t.id === taskId);
      
      if (task) {
        // Create activity for status change
        const statusName = statuses.find(s => s.id === newStatus)?.name || newStatus;
        const prevStatusName = statuses.find(s => s.id === task.status)?.name || task.status;
        
        // Update task status
        updateTask(taskId, { 
          status: newStatus,
          // If moving to completed, set progress to 100%
          progress: newStatus === 'completed' ? 100 : task.progress
        });
        
        // Show toast notification
        toast({
          title: `Task Status Updated`,
          description: `"${task.title}" has been moved to ${statusName}`
        });
      }
    } 
  };

  // Determine grid columns based on number of statuses
  const getGridCols = () => {
    const statusCount = sortedStatuses.length;
    if (statusCount <= 3) return 'md:grid-cols-3';
    if (statusCount === 4) return 'md:grid-cols-4';
    if (statusCount === 5) return 'md:grid-cols-5 xl:grid-cols-5';
    if (statusCount === 6) return 'md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6';
    return 'md:grid-cols-4 lg:grid-cols-7 xl:grid-cols-7'; // For 7+ statuses
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={cn(`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(sortedStatuses.length, 4)} gap-6 max-w-7xl mx-auto`, getGridCols(), className)}>
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

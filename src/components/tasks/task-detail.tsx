
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  MessageSquare, 
  Paperclip, 
  MoreVertical,
  ArrowLeft,
  Edit,
  Trash,
  ExternalLink,
  Save,
  X,
  User
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { CustomButton } from '../ui/custom-button';
import { useNavigate } from 'react-router-dom';
import { Task } from '../dashboard/kanban-board';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStatusStore } from '@/store/useStatusStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';

interface TaskDetailProps {
  task: Task;
  className?: string;
}

export const TaskDetail: React.FC<TaskDetailProps> = ({ task: initialTask, className }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { statuses } = useStatusStore();
  const { employees } = useEmployeeStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [task, setTask] = useState<Task>(initialTask);
  const [editedTask, setEditedTask] = useState<Task>(initialTask);

  // Format date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

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

  // Get status class and info
  const getStatusInfo = () => {
    const status = statuses.find(s => s.id === task.status);
    
    if (status) {
      return {
        color: status.color,
        text: status.name,
      };
    }
    
    switch (task.status) {
      case 'pending':
        return {
          color: 'bg-status-pending',
          text: 'Pending',
        };
      case 'in-progress':
        return {
          color: 'bg-status-in-progress',
          text: 'In Progress',
        };
      case 'completed':
        return {
          color: 'bg-status-completed',
          text: 'Completed',
        };
      case 'delayed':
        return {
          color: 'bg-status-delayed',
          text: 'Delayed',
        };
      default:
        return {
          color: 'bg-gray-300',
          text: 'Unknown',
        };
    }
  };

  // Check if task is past due date
  const isPastDue = () => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return dueDate < today && task.status !== 'completed';
  };

  const handleSaveEdit = () => {
    // In a real app, this would save to a backend
    setTask(editedTask);
    setIsEditing(false);
    
    const statusName = statuses.find(s => s.id === editedTask.status)?.name || editedTask.status;
    
    toast({
      title: "Task updated",
      description: `The task has been updated to ${statusName} with ${editedTask.progress}% progress.`,
    });
  };
  
  const handleCancelEdit = () => {
    setEditedTask(task);
    setIsEditing(false);
  };

  const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setEditedTask(prev => ({
      ...prev,
      progress: value,
    }));
  };

  const handleStatusChange = (value: string) => {
    setEditedTask(prev => {
      // If marking as completed, set progress to 100%
      if (value === 'completed') {
        return { ...prev, status: value, progress: 100 };
      }
      return { ...prev, status: value };
    });
  };

  const handleQuickComplete = () => {
    const updatedTask = { ...task, status: 'completed', progress: 100 };
    setTask(updatedTask);
    setEditedTask(updatedTask);
    
    toast({
      title: "Task completed",
      description: "The task has been marked as completed.",
    });
  };

  const statusInfo = getStatusInfo();

  return (
    <div className={cn('animate-fade-in', className)}>
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <CustomButton 
          variant="ghost" 
          size="sm" 
          icon={<ArrowLeft size={18} />}
          onClick={() => navigate(-1)}
          className="mr-3"
        >
          Back
        </CustomButton>
        <h1 className="text-2xl font-bold flex-1">Task Details</h1>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <CustomButton 
                variant="outline" 
                size="sm" 
                icon={<X size={16} />}
                onClick={handleCancelEdit}
              >
                Cancel
              </CustomButton>
              <CustomButton 
                variant="primary" 
                size="sm" 
                icon={<Save size={16} />}
                onClick={handleSaveEdit}
              >
                Save
              </CustomButton>
            </>
          ) : (
            <>
              <CustomButton 
                variant="outline" 
                size="sm" 
                icon={<Edit size={16} />}
                onClick={() => setIsEditing(true)}
              >
                Edit
              </CustomButton>
              <CustomButton 
                variant="outline" 
                size="sm" 
                icon={<Trash size={16} />}
                className="text-status-delayed"
              >
                Delete
              </CustomButton>
            </>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Task details */}
        <div className="md:col-span-2 space-y-6">
          {/* Task title and status */}
          <div className="glass-card p-6">
            <div className="flex justify-between items-start mb-4">
              {isEditing ? (
                <Input 
                  name="title"
                  value={editedTask.title}
                  onChange={handleTaskChange}
                  className="text-xl font-bold"
                />
              ) : (
                <h2 className="text-xl font-bold">{task.title}</h2>
              )}
              <div className="flex items-center">
                {isEditing ? (
                  <Select 
                    name="status"
                    value={editedTask.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="text-sm font-medium rounded-md w-[150px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map(status => (
                        <SelectItem key={status.id} value={status.id}>
                          {status.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <>
                    <div className={cn('w-2.5 h-2.5 rounded-full mr-2', statusInfo.color)} />
                    <span className="text-sm font-medium">{statusInfo.text}</span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            {isEditing ? (
              <textarea
                name="description"
                value={editedTask.description}
                onChange={handleTaskChange}
                className="w-full min-h-[100px] text-muted-foreground rounded-md border border-input p-3 mb-6"
              />
            ) : (
              <p className="text-muted-foreground mb-6">{task.description}</p>
            )}

            {/* Due date */}
            <div className="flex items-center mb-4">
              <Calendar size={18} className="text-primary mr-2" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Due Date</span>
                {isEditing ? (
                  <Input
                    type="date"
                    name="dueDate"
                    value={editedTask.dueDate}
                    onChange={handleTaskChange}
                    className="text-sm mt-1 w-40"
                  />
                ) : (
                  <span className={cn(
                    'text-sm',
                    isPastDue() && 'text-status-delayed font-medium flex items-center gap-1'
                  )}>
                    {formatDate(task.dueDate)}
                    {isPastDue() && <AlertTriangle size={12} />}
                  </span>
                )}
              </div>
            </div>

            {/* Priority */}
            <div className="flex items-center mb-6">
              <AlertTriangle size={18} className="text-primary mr-2" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Priority</span>
                {isEditing ? (
                  <Select 
                    value={editedTask.priority}
                    onValueChange={(value) => setEditedTask({...editedTask, priority: value as 'low' | 'medium' | 'high'})}
                  >
                    <SelectTrigger className="text-sm mt-1 w-40">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full font-medium w-fit mt-1',
                    getPriorityClass()
                  )}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                )}
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm font-medium">{isEditing ? editedTask.progress : task.progress}%</span>
              </div>
              {isEditing ? (
                <Input
                  type="range"
                  min="0"
                  max="100"
                  value={editedTask.progress}
                  onChange={handleProgressChange}
                  className="w-full"
                />
              ) : (
                <Progress value={task.progress} className="h-2" />
              )}
            </div>
          </div>
          
          {/* Activity log */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <MessageSquare size={16} className="mr-2" />
              Activity Log
            </h3>
            
            <div className="space-y-4">
              <div className="flex">
                <div className="mr-3">
                  <Avatar className="h-8 w-8 border border-border">
                    <div className="bg-primary text-primary-foreground flex items-center justify-center w-full h-full text-xs font-medium">
                      JD
                    </div>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">John Doe</div>
                    <div className="text-xs text-muted-foreground">2 hours ago</div>
                  </div>
                  <p className="text-sm mt-1">
                    Changed status from <span className="font-medium">Pending</span> to <span className="font-medium">In Progress</span>
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="mr-3">
                  <Avatar className="h-8 w-8 border border-border">
                    <div className="bg-primary text-primary-foreground flex items-center justify-center w-full h-full text-xs font-medium">
                      EM
                    </div>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">Emily Martinez</div>
                    <div className="text-xs text-muted-foreground">Yesterday</div>
                  </div>
                  <p className="text-sm mt-1">
                    Added a comment: "We need to review this with the design team before proceeding."
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="mr-3">
                  <Avatar className="h-8 w-8 border border-border">
                    <div className="bg-primary text-primary-foreground flex items-center justify-center w-full h-full text-xs font-medium">
                      {task.assignee.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">{task.assignee.name}</div>
                    <div className="text-xs text-muted-foreground">3 days ago</div>
                  </div>
                  <p className="text-sm mt-1">
                    Created this task
                  </p>
                </div>
              </div>
            </div>
            
            {/* Add comment */}
            <div className="mt-6">
              <div className="relative">
                <textarea 
                  placeholder="Add a comment..." 
                  className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                  rows={2}
                />
                <div className="absolute right-3 bottom-3 flex space-x-2">
                  <button className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    <Paperclip size={16} />
                  </button>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <CustomButton size="sm" variant="primary">
                  Send
                </CustomButton>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Sidebar */}
        <div className="space-y-6">
          {/* Assignee */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">Assignee</h3>
            {isEditing ? (
              <Select 
                value={task.assignee.id}
                onValueChange={(value) => {
                  const selectedEmployee = employees.find(emp => emp.id === value);
                  if (selectedEmployee) {
                    setEditedTask({
                      ...editedTask, 
                      assignee: {
                        id: selectedEmployee.id,
                        name: selectedEmployee.name,
                        avatar: selectedEmployee.avatar
                      }
                    });
                  }
                }}
              >
                <SelectTrigger className="w-full mb-2">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.filter(emp => emp.status === 'active').map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="flex items-center">
                <Avatar className="h-10 w-10 border border-border">
                  <div className="bg-primary text-primary-foreground flex items-center justify-center w-full h-full text-sm font-medium">
                    {task.assignee.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </Avatar>
                <div className="ml-3">
                  <div className="font-medium">{task.assignee.name}</div>
                  <div className="text-sm text-muted-foreground">Developer</div>
                </div>
              </div>
            )}
          </div>
          
          {/* Quick actions */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">Actions</h3>
            <div className="space-y-3">
              <CustomButton 
                fullWidth 
                variant="success" 
                icon={<CheckCircle2 size={16} />}
                onClick={handleQuickComplete}
                disabled={task.status === 'completed'}
              >
                Mark as Completed
              </CustomButton>
              <CustomButton 
                fullWidth 
                variant="warning" 
                icon={<Clock size={16} />}
              >
                Request Extension
              </CustomButton>
              <CustomButton 
                fullWidth 
                variant="outline" 
                icon={<User size={16} />}
              >
                Reassign Task
              </CustomButton>
            </div>
          </div>
          
          {/* Attachments */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Paperclip size={16} className="mr-2" />
              Attachments (2)
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center p-3 rounded-lg border border-border bg-background/40">
                <div className="p-2 rounded-md bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 mr-3">
                  <div className="w-6 h-6 flex items-center justify-center font-medium text-xs">PDF</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">Project_Requirements.pdf</div>
                  <div className="text-xs text-muted-foreground">2.4 MB • 3 days ago</div>
                </div>
                <button className="ml-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  <MoreVertical size={14} />
                </button>
              </div>
              
              <div className="flex items-center p-3 rounded-lg border border-border bg-background/40">
                <div className="p-2 rounded-md bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 mr-3">
                  <div className="w-6 h-6 flex items-center justify-center font-medium text-xs">XLS</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">Budget_Analysis.xlsx</div>
                  <div className="text-xs text-muted-foreground">1.2 MB • 1 day ago</div>
                </div>
                <button className="ml-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  <MoreVertical size={14} />
                </button>
              </div>
              
              <button className="text-sm text-primary hover:text-primary/80 flex items-center mt-2 font-medium">
                <Paperclip size={14} className="mr-1" />
                Add Attachment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

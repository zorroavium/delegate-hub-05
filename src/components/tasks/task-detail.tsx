import React, { useState, useRef } from 'react';
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
  User,
  Send,
  Download,
  Plus,
  Repeat,
  Link as LinkIcon
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { CustomButton } from '../ui/custom-button';
import { useNavigate } from 'react-router-dom';
import { Task, useTaskStore, TaskActivity } from '@/store/useTaskStore';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStatusStore } from '@/store/useStatusStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AttachmentUploader, AttachmentIcon } from '@/components/tasks/attachment-uploader';
import { TimeTracker } from '@/components/tasks/time-tracker';
import { TaskDependencies } from '@/components/tasks/task-dependencies';
import { RecurringTaskConfig } from '@/components/tasks/recurring-task-config';

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  url?: string;
}

interface TaskDetailProps {
  task: Task;
  className?: string;
}

export const TaskDetail: React.FC<TaskDetailProps> = ({ task: initialTask, className }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { statuses } = useStatusStore();
  const { employees } = useEmployeeStore();
  const { updateTask, addActivity, deleteTask, addTaskAttachment, removeTaskAttachment, addTimeEntry, stopTimeEntry, updateTimeEntry } = useTaskStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [task, setTask] = useState<Task>(initialTask);
  const [editedTask, setEditedTask] = useState<Task>(initialTask);
  const [comment, setComment] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isReassignDialogOpen, setIsReassignDialogOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [isRecurring, setIsRecurring] = useState(!!initialTask.isRecurring);
  const [recurringConfig, setRecurringConfig] = useState(initialTask.recurringConfig || {
    frequency: 'weekly',
    interval: 1,
    endAfter: 5
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) {
      return size + ' B';
    } else if (size < 1024 * 1024) {
      return (size / 1024).toFixed(1) + ' KB';
    } else {
      return (size / (1024 * 1024)).toFixed(1) + ' MB';
    }
  };

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

  const isPastDue = () => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return dueDate < today && task.status !== 'completed';
  };

  const handleSaveEdit = () => {
    const updatedTask = {
      ...editedTask,
      isRecurring,
      recurringConfig: isRecurring ? recurringConfig : undefined
    };
    
    updateTask(task.id, updatedTask);
    
    setTask(updatedTask);
    setIsEditing(false);
    
    if (task.status !== updatedTask.status) {
      const statusName = statuses.find(s => s.id === updatedTask.status)?.name || updatedTask.status;
      const prevStatusName = statuses.find(s => s.id === task.status)?.name || task.status;
      
      addActivity(task.id, {
        userId: '101',
        userName: 'John Doe',
        userAvatar: 'JD',
        action: `changed status from ${prevStatusName.replace('-', ' ')} to ${statusName.replace('-', ' ')}`,
        timestamp: new Date().toISOString(),
      });
    }
    
    if (isRecurring && !task.isRecurring) {
      useTaskStore.getState().createRecurringTasks(updatedTask);
    }
    
    const statusName = statuses.find(s => s.id === updatedTask.status)?.name || updatedTask.status;
    
    toast({
      title: "Task updated",
      description: `The task has been updated to ${statusName} with ${updatedTask.progress}% progress.`,
    });
  };
  
  const handleCancelEdit = () => {
    setEditedTask(task);
    setIsRecurring(!!task.isRecurring);
    setRecurringConfig(task.recurringConfig || {
      frequency: 'weekly',
      interval: 1,
      endAfter: 5
    });
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
      if (value === 'completed') {
        return { ...prev, status: value, progress: 100 };
      }
      return { ...prev, status: value };
    });
  };

  const handleQuickComplete = () => {
    const updatedTask = { ...task, status: 'completed', progress: 100 };
    
    updateTask(task.id, updatedTask);
    
    setTask(updatedTask);
    setEditedTask(updatedTask);
    
    addActivity(task.id, {
      userId: '101',
      userName: 'John Doe',
      userAvatar: 'JD',
      action: 'marked as completed',
      timestamp: new Date().toISOString(),
    });
    
    toast({
      title: "Task completed",
      description: "The task has been marked as completed.",
    });
  };

  const handleRequestExtension = () => {
    const currentDueDate = new Date(task.dueDate);
    const newDueDate = new Date(currentDueDate);
    newDueDate.setDate(newDueDate.getDate() + 7);
    
    const newDueDateString = newDueDate.toISOString().split('T')[0];
    
    addActivity(task.id, {
      userId: '101',
      userName: 'John Doe',
      userAvatar: 'JD',
      action: `requested a deadline extension from ${formatDate(task.dueDate)} to ${formatDate(newDueDateString)}`,
      timestamp: new Date().toISOString(),
    });
    
    toast({
      title: "Extension Requested",
      description: "Your request for an extension has been submitted.",
    });
  };

  const handleReassignTask = () => {
    if (!selectedEmployeeId) {
      toast({
        title: "Error",
        description: "Please select an employee to reassign the task.",
        variant: "destructive",
      });
      return;
    }
    
    const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);
    
    if (!selectedEmployee) return;
    
    const updatedTask = {
      ...task,
      assignee: {
        id: selectedEmployee.id,
        name: selectedEmployee.name,
        avatar: selectedEmployee.avatar,
        color: selectedEmployee.color,
      }
    };
    
    updateTask(task.id, updatedTask);
    
    setTask(updatedTask);
    setEditedTask(updatedTask);
    
    addActivity(task.id, {
      userId: '101',
      userName: 'John Doe',
      userAvatar: 'JD',
      action: `reassigned the task to ${selectedEmployee.name}`,
      timestamp: new Date().toISOString(),
    });
    
    toast({
      title: "Task Reassigned",
      description: `The task has been reassigned to ${selectedEmployee.name}.`,
    });
    
    setIsReassignDialogOpen(false);
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;
    
    addActivity(task.id, {
      userId: '101',
      userName: 'John Doe',
      userAvatar: 'JD',
      action: 'added a comment',
      comment: comment,
      timestamp: new Date().toISOString(),
    });
    
    setComment('');
    
    const updatedTask = useTaskStore.getState().getTaskById(task.id);
    if (updatedTask) {
      setTask(updatedTask);
      setEditedTask(updatedTask);
    }
    
    toast({
      title: "Comment Added",
      description: "Your comment has been added to the task.",
    });
  };

  const handleDeleteTask = () => {
    try {
      deleteTask(task.id);
      
      toast({
        title: "Task Deleted",
        description: "The task has been deleted successfully.",
      });
      
      navigate('/tasks');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the task.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (attachment: Omit<TaskAttachment, 'id'>) => {
    addTaskAttachment(task.id, attachment);
    
    const updatedTask = useTaskStore.getState().getTaskById(task.id);
    if (updatedTask) {
      setTask(updatedTask);
      setEditedTask(updatedTask);
    }
  };

  const handleDownloadAttachment = (attachment: any) => {
    toast({
      title: "Download Started",
      description: `Downloading ${attachment.name}`,
    });
  };

  const handleDeleteAttachment = (attachmentId: string) => {
    removeTaskAttachment(task.id, attachmentId);
    
    const updatedTask = useTaskStore.getState().getTaskById(task.id);
    if (updatedTask) {
      setTask(updatedTask);
      setEditedTask(updatedTask);
    }
    
    toast({
      title: "Attachment Removed",
      description: "The attachment has been removed from the task.",
    });
  };

  const handleStartTimeTracking = (entry: any) => {
    addTimeEntry(task.id, entry);
    
    const updatedTask = useTaskStore.getState().getTaskById(task.id);
    if (updatedTask) {
      setTask(updatedTask);
      setEditedTask(updatedTask);
    }
  };
  
  const handleStopTimeTracking = (entryId: string) => {
    stopTimeEntry(task.id, entryId);
    
    const updatedTask = useTaskStore.getState().getTaskById(task.id);
    if (updatedTask) {
      setTask(updatedTask);
      setEditedTask(updatedTask);
    }
  };
  
  const handleDeleteTimeEntry = (entryId: string) => {
    updateTimeEntry(task.id, entryId, { userId: 'DELETED' });
    
    const updatedTask = {
      ...task,
      timeEntries: task.timeEntries?.filter(entry => entry.id !== entryId)
    };
    
    setTask(updatedTask);
    setEditedTask(updatedTask);
    
    toast({
      title: "Time Entry Deleted",
      description: "The time entry has been removed.",
    });
  };
  
  const handleUpdateTimeEntry = (entryId: string, updates: any) => {
    updateTimeEntry(task.id, entryId, updates);
    
    const updatedTask = useTaskStore.getState().getTaskById(task.id);
    if (updatedTask) {
      setTask(updatedTask);
      setEditedTask(updatedTask);
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className={cn('animate-fade-in', className)}>
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
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                Delete
              </CustomButton>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
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

            <div className="w-full">
              {isEditing ? (
                <Textarea
                  name="description"
                  value={editedTask.description}
                  onChange={handleTaskChange}
                  className="w-full min-h-[100px] text-muted-foreground rounded-md border border-input p-3 mb-6"
                />
              ) : (
                <p className="text-muted-foreground mb-6">{task.description}</p>
              )}
            </div>

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

            {isEditing && (
              <div className="mb-6">
                <RecurringTaskConfig
                  value={recurringConfig}
                  onChange={setRecurringConfig}
                  isEnabled={isRecurring}
                  onToggle={setIsRecurring}
                />
              </div>
            )}
            
            {!isEditing && task.isRecurring && (
              <div className="flex items-center mb-6 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-md">
                <Repeat size={18} className="text-primary mr-2" />
                <div>
                  <span className="text-sm font-medium">Recurring Task</span>
                  <p className="text-xs text-muted-foreground">
                    This task repeats 
                    {task.recurringConfig?.frequency === 'daily' && ' daily'}
                    {task.recurringConfig?.frequency === 'weekly' && ' weekly'}
                    {task.recurringConfig?.frequency === 'monthly' && ' monthly'}
                    {task.recurringConfig?.interval && task.recurringConfig.interval > 1 && 
                      ` every ${task.recurringConfig.interval} ${task.recurringConfig?.frequency === 'daily' ? 'days' : 
                        task.recurringConfig?.frequency === 'weekly' ? 'weeks' : 'months'}`
                    }
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <MessageSquare size={16} className="mr-2" />
              Activity Log
            </h3>
            
            <div className="space-y-4">
              {task.activities && task.activities.map((activity) => (
                <div key={activity.id} className="flex">
                  <div className="mr-3">
                    <Avatar className="h-8 w-8 border border-border">
                      <div className="bg-primary text-primary-foreground flex items-center justify-center w-full h-full text-xs font-medium">
                        {activity.userAvatar}
                      </div>
                    </Avatar>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-sm">{activity.userName}</div>
                      <div className="text-xs text-muted-foreground">{formatTimestamp(activity.timestamp)}</div>
                    </div>
                    <p className="text-sm mt-1">
                      {activity.action}
                    </p>
                    {activity.comment && (
                      <p className="text-sm mt-1 p-2 bg-muted/50 rounded-md">
                        "{activity.comment}"
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {(!task.activities || task.activities.length === 0) && (
                <p className="text-sm text-muted-foreground">No activity yet.</p>
              )}
            </div>
            
            <div className="mt-6">
              <div className="relative">
                <Textarea 
                  placeholder="Add a comment..." 
                  className="w-full p-3 min-h-[80px] rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <div className="flex justify-end mt-2">
                <CustomButton 
                  size="sm" 
                  variant="primary" 
                  icon={<Send size={16} />}
                  onClick={handleAddComment}
                  disabled={!comment.trim()}
                >
                  Send
                </CustomButton>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">Assignee</h3>
            {isEditing ? (
              <Select 
                value={editedTask.assignee.id}
                onValueChange={(value) => {
                  const selectedEmployee = employees.find(emp => emp.id === value);
                  if (selectedEmployee) {
                    setEditedTask({
                      ...editedTask, 
                      assignee: {
                        id: selectedEmployee.id,
                        name: selectedEmployee.name,
                        avatar: selectedEmployee.avatar,
                        color: selectedEmployee.color
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
                <Avatar className={`h-10 w-10 border border-border ${task.assignee.color || 'bg-primary'}`}>
                  <div className="flex items-center justify-center w-full h-full text-sm font-medium text-white">
                    {task.assignee.avatar || task.assignee.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </Avatar>
                <div className="ml-3">
                  <div className="font-medium">{task.assignee.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {employees.find(emp => emp.id === task.assignee.id)?.role || 'Team Member'}
                  </div>
                </div>
              </div>
            )}
          </div>

          <TaskDependencies taskId={task.id} className="glass-card" />

          <TimeTracker 
            taskId={task.id}
            timeEntries={task.timeEntries || []}
            onStartTracking={handleStartTimeTracking}
            onStopTracking={handleStopTimeTracking}
            onDeleteEntry={handleDeleteTimeEntry}
            onUpdateEntry={handleUpdateTimeEntry}
          />

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
                onClick={handleRequestExtension}
                disabled={task.status === 'completed'}
              >
                Request Extension
              </CustomButton>
              <CustomButton 
                fullWidth 
                variant="outline" 
                icon={<User size={16} />}
                onClick={() => setIsReassignDialogOpen(true)}
              >
                Reassign Task
              </CustomButton>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Paperclip size={16} className="mr-2" />
              Attachments {task.attachments?.length ? `(${task.attachments.length})` : ''}
            </h3>
            
            <AttachmentUploader 
              onUpload={handleFileUpload}
              className="mb-4"
              maxSize={5}
              acceptedFileTypes={['image', 'pdf', 'docx', 'xlsx']}
            />
            
            <div className="space-y-3">
              {task.attachments && task.attachments.length > 0 ? (
                task.attachments.map((attachment) => (
                  <div 
                    key={attachment.id} 
                    className="flex items-center p-3 rounded-lg border border-border bg-background/40"
                  >
                    <div className="mr-3">
                      <AttachmentIcon type={attachment.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{attachment.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {attachment.size} • {formatTimestamp(attachment.uploadedAt)}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="ml-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                          <MoreVertical size={14} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDownloadAttachment(attachment)}>
                          <Download size={14} className="mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteAttachment(attachment.id)}
                          className="text-red-500 focus:text-red-500"
                        >
                          <Trash size={14} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground text-sm py-2">
                  No attachments yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTask}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isReassignDialogOpen} onOpenChange={setIsReassignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reassign Task</DialogTitle>
            <DialogDescription>
              Select a team member to reassign this task.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Select onValueChange={setSelectedEmployeeId}>
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees
                  .filter(emp => emp.status === 'active' && emp.id !== task.assignee.id)
                  .map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name} - {employee.role}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReassignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReassignTask}>
              Reassign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

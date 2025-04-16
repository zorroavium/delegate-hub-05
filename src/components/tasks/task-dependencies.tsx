
import React, { useState, useEffect } from 'react';
import { useTaskStore, Task } from '@/store/useTaskStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Link as LinkIcon, AlertTriangle, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface TaskDependenciesProps {
  taskId: string;
  className?: string;
}

export const TaskDependencies: React.FC<TaskDependenciesProps> = ({ taskId, className }) => {
  const { tasks, addTaskDependency, removeTaskDependency, getTaskDependencies } = useTaskStore();
  const { toast } = useToast();
  
  const [dependencies, setDependencies] = useState<{ dependsOn: Task[], dependedOnBy: Task[] }>({
    dependsOn: [],
    dependedOnBy: []
  });
  
  const [isAddDependencyOpen, setIsAddDependencyOpen] = useState(false);
  const [selectedDependencyId, setSelectedDependencyId] = useState<string>('');
  
  useEffect(() => {
    const deps = getTaskDependencies(taskId);
    setDependencies(deps);
  }, [taskId, getTaskDependencies]);
  
  const handleAddDependency = () => {
    if (!selectedDependencyId) {
      toast({
        title: "Error",
        description: "Please select a task",
        variant: "destructive"
      });
      return;
    }
    
    addTaskDependency(taskId, selectedDependencyId);
    setIsAddDependencyOpen(false);
    setSelectedDependencyId('');
    
    // Update dependencies
    const deps = getTaskDependencies(taskId);
    setDependencies(deps);
    
    toast({
      title: "Dependency added",
      description: "Task dependency has been added successfully."
    });
  };
  
  const handleRemoveDependency = (dependsOnTaskId: string) => {
    removeTaskDependency(taskId, dependsOnTaskId);
    
    // Update dependencies
    const deps = getTaskDependencies(taskId);
    setDependencies(deps);
    
    toast({
      title: "Dependency removed",
      description: "Task dependency has been removed successfully."
    });
  };
  
  // Get available tasks for dependencies (exclude the current task and any tasks that would create circular dependencies)
  const getAvailableDependencyTasks = () => {
    return tasks.filter(task => 
      task.id !== taskId && 
      !dependencies.dependsOn.some(dep => dep.id === task.id) &&
      !dependencies.dependedOnBy.some(dep => dep.id === task.id)
    );
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'delayed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <LinkIcon size={16} />
            Dependencies
          </CardTitle>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 gap-1" 
            onClick={() => setIsAddDependencyOpen(true)}
          >
            <Plus size={14} />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {dependencies.dependsOn.length === 0 && dependencies.dependedOnBy.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-4">
            No dependencies
          </div>
        ) : (
          <div className="space-y-4">
            {dependencies.dependsOn.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">This task depends on:</h4>
                <div className="space-y-2">
                  {dependencies.dependsOn.map(task => (
                    <div key={task.id} className="flex items-center justify-between bg-background p-2 rounded-md border">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{task.title}</span>
                          <Badge variant="outline" className={getStatusClass(task.status)}>
                            {task.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {task.status === 'completed' ? (
                            <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                              <CheckCircle2 size={12} />
                              Completed
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              {task.progress}% complete
                            </span>
                          )}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveDependency(task.id)}
                      >
                        <XCircle size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {dependencies.dependedOnBy.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">These tasks depend on this task:</h4>
                <div className="space-y-2">
                  {dependencies.dependedOnBy.map(task => (
                    <div key={task.id} className="flex items-center justify-between bg-accent/30 p-2 rounded-md border">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{task.title}</span>
                          <Badge variant="outline" className={getStatusClass(task.status)}>
                            {task.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <Dialog open={isAddDependencyOpen} onOpenChange={setIsAddDependencyOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Task Dependency</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm mb-4">
              Select a task that must be completed before this task can be started.
            </p>
            
            <Select onValueChange={setSelectedDependencyId} value={selectedDependencyId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a task" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableDependencyTasks().map(task => (
                  <SelectItem key={task.id} value={task.id}>
                    {task.title} ({task.status})
                  </SelectItem>
                ))}
                {getAvailableDependencyTasks().length === 0 && (
                  <SelectItem value="none" disabled>
                    No available tasks
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            
            {dependencies.dependedOnBy.length > 0 && (
              <div className="flex items-center gap-2 mt-4 p-2 rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400">
                <AlertTriangle size={16} />
                <p className="text-xs">
                  Note: Be careful with dependencies as other tasks depend on this task.
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDependencyOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDependency}>
              Add Dependency
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react';
import { Task, useTaskStore } from '@/store/useTaskStore';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';

interface TaskDependenciesProps {
  taskId: string;
  className?: string;
}

export function TaskDependencies({ taskId, className }: TaskDependenciesProps) {
  const { toast } = useToast();
  const { tasks, getTaskById, addTaskDependency, removeTaskDependency, getTaskDependencies } = useTaskStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dependencies, setDependencies] = useState<{ dependsOn: Task[], dependedOnBy: Task[] }>({ dependsOn: [], dependedOnBy: [] });
  
  // Load dependencies when taskId changes
  useEffect(() => {
    if (taskId) {
      const deps = getTaskDependencies(taskId);
      setDependencies(deps);
    }
  }, [taskId, getTaskDependencies, tasks]);
  
  const handleAddDependency = (dependencyId: string) => {
    // Check if this would create a circular dependency
    const dependencyTask = getTaskById(dependencyId);
    if (!dependencyTask) return;
    
    // If the dependency already depends on the current task (directly or indirectly),
    // adding this dependency would create a circular dependency
    const depDeps = getTaskDependencies(dependencyId);
    if (depDeps.dependsOn.some(t => t.id === taskId)) {
      toast({
        title: "Cannot add dependency",
        description: "This would create a circular dependency.",
        variant: "destructive"
      });
      return;
    }
    
    // Add the dependency
    addTaskDependency(taskId, dependencyId);
    setIsAddDialogOpen(false);
    setSearchQuery('');
    
    toast({
      title: "Dependency added",
      description: `Task now depends on "${dependencyTask.title}"`,
    });
  };
  
  const handleRemoveDependency = (dependencyId: string) => {
    const dependencyTask = getTaskById(dependencyId);
    if (!dependencyTask) return;
    
    removeTaskDependency(taskId, dependencyId);
    
    toast({
      title: "Dependency removed",
      description: `Task no longer depends on "${dependencyTask.title}"`,
    });
  };
  
  // Filter tasks for the search dialog
  const filteredTasks = tasks.filter(task => 
    task.id !== taskId && // Don't show the current task
    !dependencies.dependsOn.some(t => t.id === task.id) && // Don't show tasks that are already dependencies
    (
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  
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
    <div className={className}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <div>Dependencies</div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsAddDialogOpen(true)}
              className="h-8 px-2"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </CardTitle>
          <CardDescription>
            Tasks that need to be completed first
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dependencies.dependsOn.length > 0 ? (
            <div className="space-y-2">
              {dependencies.dependsOn.map(dep => (
                <div 
                  key={dep.id}
                  className="flex items-center justify-between p-2 bg-muted/30 rounded-md"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={getStatusClass(dep.status)}>
                        {dep.status}
                      </Badge>
                      <span className="font-medium text-sm truncate">{dep.title}</span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 ml-2 flex-shrink-0"
                    onClick={() => handleRemoveDependency(dep.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground text-sm text-center py-2">
              No dependencies added
            </div>
          )}
          
          {dependencies.dependedOnBy.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Dependent Tasks</h4>
              <div className="space-y-2">
                {dependencies.dependedOnBy.map(dep => (
                  <div 
                    key={dep.id}
                    className="flex items-center p-2 bg-muted/30 rounded-md"
                  >
                    <ChevronRight className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={getStatusClass(dep.status)}>
                          {dep.status}
                        </Badge>
                        <span className="font-medium text-sm truncate">{dep.title}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Dialog for adding dependencies */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Task Dependency</DialogTitle>
            <DialogDescription>
              Select a task that needs to be completed before this task.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4"
            />
            
            <ScrollArea className="h-60">
              {filteredTasks.length > 0 ? (
                <div className="space-y-2">
                  {filteredTasks.map(task => (
                    <div 
                      key={task.id}
                      className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md cursor-pointer"
                      onClick={() => handleAddDependency(task.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          {task.status === 'completed' ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                          )}
                          <span className="font-medium text-sm">{task.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-2">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No matching tasks found
                </div>
              )}
            </ScrollArea>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

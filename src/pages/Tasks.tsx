
import React, { useState, useEffect } from 'react';
import { SidebarLayout } from '@/components/layout/sidebar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Calendar, 
  CheckCircle2, 
  ChevronDown, 
  Clock, 
  Filter, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  AlertTriangle 
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Link } from 'react-router-dom';
import { CreateTaskDialog } from '@/components/tasks/create-task-dialog';
import { useToast } from "@/hooks/use-toast";
import { useTaskStore } from '@/store/useTaskStore';

const TaskCard = ({ task }: { task: any }) => {
  // Define colors for priority badges
  const priorityColors = {
    high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500",
    low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
  };
  
  // Define colors for status badges
  const statusColors = {
    'completed': "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
    'in-progress': "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500",
    'pending': "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500",
  };
  
  // Get the target colors based on priority and status
  const priorityColor = priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.medium;
  const statusColor = statusColors[task.status as keyof typeof statusColors] || statusColors.pending;
  
  return (
    <Link to={`/task/${task.id}`} className="block hover:no-underline">
      <Card className="h-full hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-lg">{task.title}</h3>
            <Badge className={priorityColor}>{task.priority}</Badge>
          </div>
          
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{task.description}</p>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Due: {task.dueDate}</span>
            </div>
            <Badge className={statusColor}>{task.status.replace('-', ' ')}</Badge>
          </div>
          
          <Progress value={task.progress} className="h-2 mb-4" />
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Avatar className={`h-8 w-8 ${task.assignee.color}`}>
                <span className="text-xs text-white">{task.assignee.avatar}</span>
              </Avatar>
              <span className="text-sm">{task.assignee.name}</span>
            </div>
            <div className="text-sm font-medium">{task.progress}%</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const TasksPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [showThisWeek, setShowThisWeek] = useState(false);
  const { toast } = useToast();
  
  // Get tasks from store
  const { tasks, addTask } = useTaskStore();
  
  // Filter tasks based on status, priority, time frame, and search query
  const filteredTasks = tasks.filter(task => {
    // Apply tab filter
    if (filter !== 'all' && task.status !== filter) {
      return false;
    }
    
    // Apply priority filter
    if (selectedPriority && task.priority !== selectedPriority) {
      return false;
    }
    
    // Apply due this week filter
    if (showThisWeek) {
      const taskDate = new Date(task.dueDate);
      const today = new Date();
      const weekFromNow = new Date();
      weekFromNow.setDate(today.getDate() + 7);
      
      if (taskDate < today || taskDate > weekFromNow) {
        return false;
      }
    }
    
    // Apply search query
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Handle task creation
  const handleTaskCreated = (newTask: any) => {
    // Add activity to the task
    const taskWithActivity = {
      ...newTask,
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

  // Handle filter changes
  const handlePriorityFilter = (priority: string) => {
    setSelectedPriority(prev => prev === priority ? null : priority);
  };

  const handleWeekFilter = () => {
    setShowThisWeek(prev => !prev);
  };

  const clearFilters = () => {
    setSelectedPriority(null);
    setShowThisWeek(false);
  };
  
  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <div className="w-full md:w-auto flex gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  <Filter size={16} />
                  <span className="hidden md:inline">Filter</span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleWeekFilter}>
                  <Calendar size={16} className="mr-2" />
                  <span>Due this week</span>
                  {showThisWeek && <CheckCircle2 size={16} className="ml-auto text-green-500" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePriorityFilter('high')}>
                  <AlertTriangle size={16} className="mr-2" />
                  <span>High priority</span>
                  {selectedPriority === 'high' && <CheckCircle2 size={16} className="ml-auto text-green-500" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePriorityFilter('medium')}>
                  <AlertTriangle size={16} className="mr-2" />
                  <span>Medium priority</span>
                  {selectedPriority === 'medium' && <CheckCircle2 size={16} className="ml-auto text-green-500" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePriorityFilter('low')}>
                  <AlertTriangle size={16} className="mr-2" />
                  <span>Low priority</span>
                  {selectedPriority === 'low' && <CheckCircle2 size={16} className="ml-auto text-green-500" />}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={clearFilters}>
                  <SlidersHorizontal size={16} className="mr-2" />
                  Clear filters
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus size={16} className="mr-1" />
              New Task
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
              {filteredTasks.length === 0 && (
                <div className="col-span-3 py-10 text-center">
                  <p className="text-muted-foreground">No tasks found matching your criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="pending" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
              {filteredTasks.length === 0 && (
                <div className="col-span-3 py-10 text-center">
                  <p className="text-muted-foreground">No pending tasks found.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="in-progress" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
              {filteredTasks.length === 0 && (
                <div className="col-span-3 py-10 text-center">
                  <p className="text-muted-foreground">No in-progress tasks found.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="completed" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
              {filteredTasks.length === 0 && (
                <div className="col-span-3 py-10 text-center">
                  <p className="text-muted-foreground">No completed tasks found.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Task Creation Dialog */}
      <CreateTaskDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onTaskCreated={handleTaskCreated}
      />
    </SidebarLayout>
  );
};

export default TasksPage;


import React, { useState, useEffect } from 'react';
import { SidebarLayout } from '@/components/layout/sidebar';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  ChevronDown, 
  Filter, 
  Plus, 
  Search, 
  Clock,
  Clipboard,
  ListChecks,
  FileText
} from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { CreateTaskDialog } from '@/components/tasks/create-task-dialog';
import { useToast } from "@/hooks/use-toast";
import { useTaskStore } from '@/store/useTaskStore';
import { useStatusStore } from '@/store/useStatusStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { TaskList } from '@/components/tasks/task-list';
import { TaskFilterBar } from '@/components/tasks/task-filter-bar';
import { TaskCalendarView } from '@/components/tasks/task-calendar-view';
import { TaskTemplates } from '@/components/tasks/task-templates';
import { TaskExportImport } from '@/components/tasks/task-export-import';
import { TaskReminders } from '@/components/tasks/task-reminders';

const TasksPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get the filter parameters from URL
  const initialFilter = searchParams.get('status') || 'all';
  const initialEmployee = searchParams.get('employee') || null;
  const initialView = searchParams.get('view') || 'list';
  
  const [filter, setFilter] = useState(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(initialEmployee);
  const [showThisWeek, setShowThisWeek] = useState(false);
  const [view, setView] = useState<'list' | 'calendar' | 'templates'>(initialView as any || 'list');
  const { toast } = useToast();
  
  // Get tasks from store
  const { tasks, addTask } = useTaskStore();
  const { statuses } = useStatusStore();
  const { employees } = useEmployeeStore();
  
  // Sort statuses by order for tabs
  const sortedStatuses = [...statuses].sort((a, b) => a.order - b.order);
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filter !== 'all') {
      params.set('status', filter);
    }
    if (selectedEmployee) {
      params.set('employee', selectedEmployee);
    }
    if (view !== 'list') {
      params.set('view', view);
    }
    setSearchParams(params);
  }, [filter, selectedEmployee, view, setSearchParams]);
  
  // Set initial filters from URL on mount
  useEffect(() => {
    if (initialFilter !== 'all') {
      setFilter(initialFilter);
    }
    if (initialEmployee) {
      setSelectedEmployee(initialEmployee);
    }
    if (initialView && ['list', 'calendar', 'templates'].includes(initialView)) {
      setView(initialView as any);
    }
  }, [initialFilter, initialEmployee, initialView]);
  
  // Filter tasks based on status, priority, time frame, employee and search query
  const filteredTasks = tasks.filter(task => {
    // Apply tab filter (status)
    if (filter !== 'all' && task.status !== filter) {
      return false;
    }
    
    // Apply priority filter
    if (selectedPriority && task.priority !== selectedPriority) {
      return false;
    }
    
    // Apply employee filter
    if (selectedEmployee && task.assignee.id !== selectedEmployee) {
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
    
    // Create recurring tasks if needed
    if (taskWithActivity.isRecurring && taskWithActivity.recurringConfig) {
      useTaskStore.getState().createRecurringTasks(taskWithActivity);
    }
  };

  // Handle filter changes
  const handlePriorityFilter = (priority: string) => {
    setSelectedPriority(prev => prev === priority ? null : priority);
  };

  const handleEmployeeFilter = (employeeId: string | null) => {
    setSelectedEmployee(employeeId);
  };

  const handleWeekFilter = () => {
    setShowThisWeek(prev => !prev);
  };

  const clearFilters = () => {
    setSelectedPriority(null);
    setSelectedEmployee(null);
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
            
            {view === 'list' && (
              <TaskFilterBar 
                selectedPriority={selectedPriority}
                selectedEmployee={selectedEmployee}
                showThisWeek={showThisWeek}
                onPriorityChange={handlePriorityFilter}
                onEmployeeChange={handleEmployeeFilter}
                onWeekChange={handleWeekFilter}
                onClearFilters={clearFilters}
                employees={employees}
              />
            )}
            
            <div className="flex gap-2">
              <Button 
                variant={view === 'list' ? 'default' : 'outline'} 
                size="icon"
                onClick={() => setView('list')}
                title="List View"
              >
                <ListChecks size={16} />
              </Button>
              <Button 
                variant={view === 'calendar' ? 'default' : 'outline'} 
                size="icon"
                onClick={() => setView('calendar')}
                title="Calendar View"
              >
                <CalendarIcon size={16} />
              </Button>
              <Button 
                variant={view === 'templates' ? 'default' : 'outline'} 
                size="icon"
                onClick={() => setView('templates')}
                title="Templates"
              >
                <Clipboard size={16} />
              </Button>
            </div>
            
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus size={16} className="mr-1" />
              New Task
            </Button>
          </div>
        </div>
        
        {view === 'list' && (
          <Tabs defaultValue={filter} value={filter} className="w-full" onValueChange={setFilter}>
            <TabsList className="flex flex-wrap justify-start">
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              
              {sortedStatuses.map((status) => (
                <TabsTrigger key={status.id} value={status.id}>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${status.color}`}></div>
                    {status.name}
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <TaskList tasks={filteredTasks} emptyMessage="No tasks found matching your criteria." />
            </TabsContent>
            
            {sortedStatuses.map((status) => (
              <TabsContent key={status.id} value={status.id} className="mt-6">
                <TaskList 
                  tasks={filteredTasks} 
                  emptyMessage={`No ${status.name.toLowerCase()} tasks found.`} 
                />
              </TabsContent>
            ))}
          </Tabs>
        )}
        
        {view === 'calendar' && (
          <TaskCalendarView />
        )}
        
        {view === 'templates' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TaskTemplates />
            </div>
            <div className="space-y-6">
              <TaskReminders />
              <TaskExportImport />
            </div>
          </div>
        )}
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

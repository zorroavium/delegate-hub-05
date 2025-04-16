
import React, { useState, useEffect } from 'react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock,
  Plus,
  AlertCircle
} from 'lucide-react';
import { format, isToday, isSameDay, isSameMonth, addMonths, subMonths, startOfMonth } from 'date-fns';
import { useTaskStore, Task } from '@/store/useTaskStore';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { CreateTaskDialog } from '@/components/tasks/create-task-dialog';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface TasksByDate {
  [date: string]: Task[];
}

export function TaskCalendarView() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { tasks, addTask } = useTaskStore();
  const [date, setDate] = useState<Date>(new Date());
  const [month, setMonth] = useState<Date>(startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [tasksByDate, setTasksByDate] = useState<TasksByDate>({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createForDate, setCreateForDate] = useState<Date | null>(null);
  
  // Organize tasks by date
  useEffect(() => {
    const taskMap: TasksByDate = {};
    
    tasks.forEach(task => {
      const dateStr = task.dueDate;
      if (!taskMap[dateStr]) {
        taskMap[dateStr] = [];
      }
      taskMap[dateStr].push(task);
    });
    
    setTasksByDate(taskMap);
  }, [tasks]);
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setMonth(subMonths(month, 1));
    } else {
      setMonth(addMonths(month, 1));
    }
  };
  
  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    
    // Convert Date to string format (YYYY-MM-DD) that matches task.dueDate
    const dateStr = format(day, 'yyyy-MM-dd');
    
    // Check if there are tasks for this date
    if (!tasksByDate[dateStr] || tasksByDate[dateStr].length === 0) {
      toast({
        title: "No tasks",
        description: `No tasks are due on ${format(day, 'MMMM d, yyyy')}`
      });
    }
  };
  
  const handleDayDoubleClick = (day: Date) => {
    setCreateForDate(day);
    setIsCreateDialogOpen(true);
  };
  
  const handleCreateTaskForDate = () => {
    if (selectedDate) {
      setCreateForDate(selectedDate);
      setIsCreateDialogOpen(true);
    }
  };
  
  const handleTaskCreated = (newTask: Task) => {
    addTask(newTask);
    
    toast({
      title: "Task Created",
      description: `"${newTask.title}" has been created successfully.`
    });
    
    // If the created task's date matches the selected date, make sure the day remains selected
    if (selectedDate && newTask.dueDate === format(selectedDate, 'yyyy-MM-dd')) {
      setSelectedDate(selectedDate);
    }
  };
  
  // Generate an array of dates with tasks for the current month
  const getDaysWithTasks = () => {
    const result: Date[] = [];
    
    Object.keys(tasksByDate).forEach(dateStr => {
      const taskDate = new Date(dateStr);
      if (isSameMonth(taskDate, month)) {
        result.push(taskDate);
      }
    });
    
    return result;
  };
  
  // Get tasks for the selected date
  const getTasksForSelectedDate = (): Task[] => {
    if (!selectedDate) return [];
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return tasksByDate[dateStr] || [];
  };
  
  // Get status className for a task
  const getStatusClass = (status: string): string => {
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
  
  // Custom day rendering for the calendar
  const renderDay = (day: Date, selectedDay: Date[], locale: string) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const hasTasksForDay = tasksByDate[dateStr] && tasksByDate[dateStr].length > 0;
    const tasksForDay = tasksByDate[dateStr] || [];
    const isSelected = selectedDate && isSameDay(day, selectedDate);
    const isCurrentMonth = isSameMonth(day, month);
    
    // Find highest priority task for this day
    const highPriorityTask = tasksForDay.find(task => task.priority === 'high');
    const mediumPriorityTask = tasksForDay.find(task => task.priority === 'medium');
    
    let priorityDot = null;
    if (highPriorityTask) {
      priorityDot = <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></div>;
    } else if (mediumPriorityTask) {
      priorityDot = <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-amber-500 rounded-full"></div>;
    }
    
    // Group tasks by status
    const completedCount = tasksForDay.filter(t => t.status === 'completed').length;
    const pendingCount = tasksForDay.filter(t => t.status !== 'completed').length;
    
    return (
      <div 
        className={`
          w-full h-full p-1 relative flex flex-col items-center justify-center
          ${!isCurrentMonth ? 'opacity-30' : ''}
          ${isSelected ? 'bg-primary/10 rounded-md' : ''}
        `}
      >
        <div className={`text-sm ${isToday(day) ? 'font-bold' : ''}`}>
          {day.getDate()}
        </div>
        
        {hasTasksForDay && (
          <div className="flex gap-[2px] mt-1">
            {completedCount > 0 && <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>}
            {pendingCount > 0 && <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>}
          </div>
        )}
        
        {priorityDot}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5" />
                <span>Calendar</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm font-medium min-w-[100px] text-center">
                  {format(month, 'MMMM yyyy')}
                </div>
                <Button variant="outline" size="icon" onClick={() => navigateMonth('next')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={selectedDate ? [selectedDate] : []}
              month={month}
              onMonthChange={setMonth}
              className="rounded-md border"
              onDayClick={handleDayClick}
              onDayDoubleClick={handleDayDoubleClick}
              components={{
                Day: ({ date, ...props }) => renderDay(date!, props.selected, props.locale || 'en-US')
              }}
            />
          </CardContent>
        </Card>
        
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>
                {selectedDate 
                  ? format(selectedDate, 'MMMM d, yyyy') 
                  : 'Select a date'}
              </CardTitle>
              {selectedDate && (
                <Button size="sm" className="gap-1" onClick={handleCreateTaskForDate}>
                  <Plus className="h-4 w-4" />
                  New Task
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              <div>
                <div className="mb-2 text-sm text-muted-foreground">
                  {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEEE')}
                </div>
                
                <ScrollArea className="h-[300px] pr-4">
                  {getTasksForSelectedDate().length > 0 ? (
                    <div className="space-y-2">
                      {getTasksForSelectedDate().map(task => (
                        <div 
                          key={task.id}
                          className="p-3 border rounded-md hover:bg-accent/50 cursor-pointer transition-colors"
                          onClick={() => navigate(`/task/${task.id}`)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-medium line-clamp-1">{task.title}</div>
                            <Badge variant="outline" className={getStatusClass(task.status)}>
                              {task.status.replace('-', ' ')}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{task.progress}% complete</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {task.priority === 'high' && (
                                <AlertCircle className="h-3 w-3 text-red-500" />
                              )}
                              <span className="text-muted-foreground">{task.assignee.name}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                      <CalendarIcon className="h-12 w-12 mb-4 opacity-20" />
                      <p>No tasks scheduled for this day</p>
                      <Button 
                        variant="link" 
                        className="mt-2"
                        onClick={handleCreateTaskForDate}
                      >
                        Add a task
                      </Button>
                    </div>
                  )}
                </ScrollArea>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                <CalendarIcon className="h-16 w-16 mb-4 opacity-20" />
                <p>Select a date to view tasks</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Task Creation Dialog */}
      <CreateTaskDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onTaskCreated={handleTaskCreated}
        initialDueDate={createForDate ? format(createForDate, 'yyyy-MM-dd') : undefined}
      />
    </div>
  );
}

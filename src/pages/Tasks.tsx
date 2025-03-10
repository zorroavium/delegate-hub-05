
import React, { useState } from 'react';
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

// Mock data for tasks
const tasksMock = [
  {
    id: '1',
    title: 'Update website content',
    description: 'Update the company website with new product information.',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2023-06-15',
    progress: 60,
    assignee: {
      id: '101',
      name: 'Sarah Johnson',
      avatar: 'SJ',
      color: 'bg-blue-500'
    },
  },
  {
    id: '2',
    title: 'Prepare quarterly report',
    description: 'Compile sales and marketing data for Q2 2023.',
    status: 'pending',
    priority: 'medium',
    dueDate: '2023-06-30',
    progress: 20,
    assignee: {
      id: '102',
      name: 'Mike Anderson',
      avatar: 'MA',
      color: 'bg-green-500'
    },
  },
  {
    id: '3',
    title: 'Client presentation',
    description: 'Create presentation slides for the upcoming client meeting.',
    status: 'pending',
    priority: 'high',
    dueDate: '2023-06-10',
    progress: 0,
    assignee: {
      id: '103',
      name: 'Emily Chen',
      avatar: 'EC',
      color: 'bg-purple-500'
    },
  },
  {
    id: '4',
    title: 'System maintenance',
    description: 'Perform routine maintenance on servers and databases.',
    status: 'completed',
    priority: 'low',
    dueDate: '2023-06-05',
    progress: 100,
    assignee: {
      id: '104',
      name: 'Alex Thompson',
      avatar: 'AT',
      color: 'bg-yellow-500'
    },
  },
  {
    id: '5',
    title: 'Update mobile app',
    description: 'Push new features to the mobile application.',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2023-06-20',
    progress: 40,
    assignee: {
      id: '101',
      name: 'Sarah Johnson',
      avatar: 'SJ',
      color: 'bg-blue-500'
    },
  },
  {
    id: '6',
    title: 'Social media campaign',
    description: 'Launch new social media marketing campaign.',
    status: 'completed',
    priority: 'high',
    dueDate: '2023-06-01',
    progress: 100,
    assignee: {
      id: '103',
      name: 'Emily Chen',
      avatar: 'EC',
      color: 'bg-purple-500'
    },
  },
];

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
  
  // Filter tasks based on status and search query
  const filteredTasks = tasksMock.filter(task => {
    // Apply tab filter
    if (filter !== 'all' && task.status !== filter) {
      return false;
    }
    
    // Apply search query
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
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
                <DropdownMenuItem>
                  <Calendar size={16} className="mr-2" />
                  Due this week
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <AlertTriangle size={16} className="mr-2" />
                  High priority
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CheckCircle2 size={16} className="mr-2" />
                  Completed
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <SlidersHorizontal size={16} className="mr-2" />
                  Advanced filters
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button>
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
    </SidebarLayout>
  );
};

export default TasksPage;

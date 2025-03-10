
import React from 'react';
import { SidebarLayout } from '@/components/layout/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Download, FileText, ChevronDown, TrendingUp, ChartPieIcon, TrendingDown } from 'lucide-react';

// Mock data for charts
const taskCompletionData = [
  { name: 'Mon', completed: 12, pending: 5 },
  { name: 'Tue', completed: 18, pending: 8 },
  { name: 'Wed', completed: 15, pending: 7 },
  { name: 'Thu', completed: 20, pending: 4 },
  { name: 'Fri', completed: 25, pending: 3 },
  { name: 'Sat', completed: 10, pending: 2 },
  { name: 'Sun', completed: 5, pending: 1 },
];

const monthlyPerformanceData = [
  { name: 'Jan', tasks: 65, efficiency: 75 },
  { name: 'Feb', tasks: 70, efficiency: 78 },
  { name: 'Mar', tasks: 85, efficiency: 82 },
  { name: 'Apr', tasks: 78, efficiency: 80 },
  { name: 'May', tasks: 90, efficiency: 85 },
  { name: 'Jun', tasks: 95, efficiency: 88 },
];

const taskCategoryData = [
  { name: 'Development', value: 35 },
  { name: 'Marketing', value: 25 },
  { name: 'Design', value: 20 },
  { name: 'Content', value: 15 },
  { name: 'Admin', value: 5 },
];

const employeePerformanceData = [
  { name: 'Sarah J.', tasks: 35, efficiency: 92 },
  { name: 'Mike A.', tasks: 28, efficiency: 85 },
  { name: 'Emily C.', tasks: 32, efficiency: 88 },
  { name: 'Alex T.', tasks: 25, efficiency: 80 },
  { name: 'Jessica M.', tasks: 30, efficiency: 90 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ReportsPage = () => {
  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground mt-1">Analytics and performance metrics</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Select defaultValue="thisWeek">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="thisWeek">This Week</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="lastQuarter">Last Quarter</SelectItem>
                <SelectItem value="thisYear">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-1">
              <Download size={16} />
              <span className="hidden md:inline">Export</span>
              <ChevronDown size={14} className="ml-1" />
            </Button>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">248</div>
                <div className="flex items-center text-green-500 bg-green-100 px-2 py-1 rounded dark:bg-green-900/30">
                  <TrendingUp size={14} className="mr-1" />
                  <span className="text-xs font-medium">12%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">vs previous period</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">85%</div>
                <div className="flex items-center text-green-500 bg-green-100 px-2 py-1 rounded dark:bg-green-900/30">
                  <TrendingUp size={14} className="mr-1" />
                  <span className="text-xs font-medium">5%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">vs previous period</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">1.2 days</div>
                <div className="flex items-center text-green-500 bg-green-100 px-2 py-1 rounded dark:bg-green-900/30">
                  <TrendingDown size={14} className="mr-1" />
                  <span className="text-xs font-medium">15%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">vs previous period</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Team Efficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">92%</div>
                <div className="flex items-center text-red-500 bg-red-100 px-2 py-1 rounded dark:bg-red-900/30">
                  <TrendingDown size={14} className="mr-1" />
                  <span className="text-xs font-medium">2%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">vs previous period</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="team">Team Performance</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Task Completion Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Task Completion</CardTitle>
                <CardDescription>Tasks completed vs pending per day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={taskCompletionData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completed" name="Completed" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="pending" name="Pending" fill="#F97316" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Monthly Performance Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Task Categories</CardTitle>
                  <CardDescription>Distribution of tasks by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={taskCategoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {taskCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Performance</CardTitle>
                  <CardDescription>Tasks completed and overall efficiency</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="tasks" name="Tasks Completed" stroke="#4F46E5" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="efficiency" name="Efficiency %" stroke="#10B981" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="tasks" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Status Breakdown</CardTitle>
                <CardDescription>Detailed view of task completion rates and statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={taskCompletionData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completed" name="Completed" fill="#10B981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="pending" name="Pending" fill="#F97316" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="team" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Employee Performance</CardTitle>
                <CardDescription>Tasks completed and efficiency by team member</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={employeePerformanceData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="tasks" name="Tasks Completed" fill="#4F46E5" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="efficiency" name="Efficiency %" fill="#10B981" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="insights" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartPieIcon className="h-5 w-5 text-primary" />
                  AI-Powered Insights
                </CardTitle>
                <CardDescription>Smart recommendations based on your team's performance data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r dark:bg-blue-900/20">
                    <h3 className="font-medium text-blue-700 dark:text-blue-300">Workload Optimization</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-200 mt-1">
                      Team members Emily C. and Mike A. are experiencing high workloads. Consider redistributing 
                      3-4 tasks from each to Alex T. who has 30% lower task assignment.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r dark:bg-green-900/20">
                    <h3 className="font-medium text-green-700 dark:text-green-300">Efficiency Improvements</h3>
                    <p className="text-sm text-green-600 dark:text-green-200 mt-1">
                      The Development team has increased efficiency by 15% since implementing the new task 
                      categorization system. Consider extending this approach to the Marketing team.
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r dark:bg-yellow-900/20">
                    <h3 className="font-medium text-yellow-700 dark:text-yellow-300">Task Prioritization</h3>
                    <p className="text-sm text-yellow-600 dark:text-yellow-200 mt-1">
                      5 high-priority tasks are approaching their deadlines within the next 48 hours. 
                      Consider reviewing and potentially reassigning these tasks to ensure timely completion.
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r dark:bg-purple-900/20">
                    <h3 className="font-medium text-purple-700 dark:text-purple-300">Process Optimization</h3>
                    <p className="text-sm text-purple-600 dark:text-purple-200 mt-1">
                      Content approval workflows are taking 2.3 days longer than other categories. Consider 
                      streamlining the review process to improve turnaround times.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="outline" className="gap-2">
                    <FileText size={16} />
                    Generate Full Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
};

export default ReportsPage;

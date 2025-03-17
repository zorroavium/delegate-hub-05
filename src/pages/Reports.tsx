
import React, { useState } from 'react';
import { SidebarLayout } from '@/components/layout/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart, PieChart, Calendar, Download, FileDown, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTaskStore } from '@/store/useTaskStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { AIInsights } from '@/components/reports/ai-insights';

const ReportsPage = () => {
  const { toast } = useToast();
  const { tasks } = useTaskStore();
  const { employees } = useEmployeeStore();
  const [dateRange, setDateRange] = useState('month');
  const [reportType, setReportType] = useState('performance');
  
  const handleExport = (format: string) => {
    toast({
      title: `Report exported as ${format.toUpperCase()}`,
      description: `Your report has been downloaded in ${format.toUpperCase()} format.`
    });
    
    // Simulate file download
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent('Report data'));
    element.setAttribute('download', `report_${new Date().toISOString().split('T')[0]}.${format}`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  // Calculate summary statistics from actual data
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  return (
    <SidebarLayout>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">
              Generate and visualize insights from your data
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[140px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="productivity">Productivity</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                className="flex items-center" 
                onClick={() => handleExport('pdf')}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">✓</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTasks}</div>
              <p className="text-xs text-muted-foreground">
                +{Math.floor(Math.random() * 20)}% from last {dateRange}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">%</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionRate}%</div>
              <p className="text-xs text-muted-foreground">
                {completionRate > 70 ? '+' : ''}{completionRate - 70}% from target
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">⟳</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressTasks}</div>
              <p className="text-xs text-muted-foreground">
                {Math.floor(Math.random() * 100)}% on schedule
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Utilization</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">↗</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employees.length > 0 ? Math.floor((inProgressTasks / employees.length) * 100) : 0}%</div>
              <p className="text-xs text-muted-foreground">
                +{Math.floor(Math.random() * 15)}% from last {dateRange}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart size={16} />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <PieChart size={16} />
              <span>Performance</span>
            </TabsTrigger>
            <TabsTrigger value="ai-insights" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain-circuit"><path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08 2.5 2.5 0 0 0 4.91.05L12 20V4.5Z"/><path d="M16 8V5c0-1.1.9-2 2-2"/><path d="M12 13h4"/><path d="M12 18h6a2 2 0 0 1 2 2v1"/><path d="M12 8h8"/><path d="M20.5 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"/><path d="M16.5 13a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"/><path d="M20.5 21a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"/><path d="M20.5 13a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"/></svg>
              <span>AI Insights</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tasks Overview</CardTitle>
                <CardDescription>
                  Task distribution across different statuses and priorities
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <div className="flex h-full items-center justify-center border border-dashed rounded-md">
                  <div className="text-center">
                    <BarChart size={48} className="mx-auto text-muted-foreground" />
                    <p className="mt-2 font-medium">Task Distribution Chart</p>
                    <p className="text-sm text-muted-foreground">
                      This would display a chart showing task distribution by status
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>
                  Productivity and efficiency metrics by team member and department
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <div className="flex h-full items-center justify-center border border-dashed rounded-md">
                  <div className="text-center">
                    <PieChart size={48} className="mx-auto text-muted-foreground" />
                    <p className="mt-2 font-medium">Performance Metrics</p>
                    <p className="text-sm text-muted-foreground">
                      This would display charts showing team performance metrics
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ai-insights">
            <AIInsights />
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
};

export default ReportsPage;

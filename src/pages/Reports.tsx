
import React from 'react';
import { SidebarLayout } from '@/components/layout/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChartNavigation } from '@/components/reports/chart-navigation';
import { TaskDistributionChart, TeamPerformanceChart } from '@/components/reports/performance-chart';
import { AIInsights } from '@/components/reports/ai-insights';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { 
  Clock, 
  CheckCircle, 
  MessageSquare, 
  PlayCircle, 
  FileCheck,
  ActivitySquare,
  TrendingUp,
  Users,
  Calendar,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Reports: React.FC = () => {
  const activities = [
    {
      id: 1,
      user: { name: 'Sarah Johnson', initials: 'SJ', avatar: null, color: 'bg-blue-500' },
      action: 'completed',
      item: 'Update website content',
      time: '2 hours ago',
      type: 'completion',
    },
    {
      id: 2,
      user: { name: 'Mike Anderson', initials: 'MA', avatar: null, color: 'bg-green-500' },
      action: 'started',
      item: 'Prepare quarterly report',
      time: '4 hours ago',
      type: 'start',
    },
    {
      id: 3,
      user: { name: 'Emily Chen', initials: 'EC', avatar: null, color: 'bg-purple-500' },
      action: 'added comments to',
      item: 'Client presentation',
      time: 'Yesterday at 3:45 PM',
      type: 'comment',
    },
    {
      id: 4,
      user: { name: 'Alex Thompson', initials: 'AT', avatar: null, color: 'bg-yellow-500' },
      action: 'marked',
      item: 'System maintenance',
      time: 'Yesterday at 10:30 AM',
      suffix: 'as completed',
      type: 'completion',
    },
  ];

  // Get icon for activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'completion':
        return <CheckCircle size={16} className="text-emerald-500" />;
      case 'start':
        return <PlayCircle size={16} className="text-blue-500" />;
      case 'comment':
        return <MessageSquare size={16} className="text-purple-500" />;
      case 'file':
        return <FileCheck size={16} className="text-amber-500" />;
      default:
        return <ActivitySquare size={16} className="text-gray-500" />;
    }
  };

  // Get background color for activity card
  const getActivityCardClass = (type: string) => {
    switch (type) {
      case 'completion':
        return 'bg-emerald-50 dark:bg-emerald-900/10 border-l-emerald-500';
      case 'start':
        return 'bg-blue-50 dark:bg-blue-900/10 border-l-blue-500';
      case 'comment':
        return 'bg-purple-50 dark:bg-purple-900/10 border-l-purple-500';
      case 'file':
        return 'bg-amber-50 dark:bg-amber-900/10 border-l-amber-500';
      default:
        return 'bg-gray-50 dark:bg-gray-900/10 border-l-gray-500';
    }
  };

  // Sample data for the productivity trends
  const productivityData = [
    { month: 'Jan', tasks: 65, meetings: 12 },
    { month: 'Feb', tasks: 75, meetings: 18 },
    { month: 'Mar', tasks: 60, meetings: 15 },
    { month: 'Apr', tasks: 80, meetings: 21 },
    { month: 'May', tasks: 90, meetings: 16 },
    { month: 'Jun', tasks: 85, meetings: 14 },
  ];

  // Sample data for project status
  const projectStatus = [
    { name: 'Website Redesign', progress: 75, color: 'bg-blue-500' },
    { name: 'Mobile App Development', progress: 45, color: 'bg-purple-500' },
    { name: 'Marketing Campaign', progress: 90, color: 'bg-green-500' },
    { name: 'Customer Portal', progress: 30, color: 'bg-amber-500' },
  ];

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="justify-start">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="team">Team Performance</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <ChartNavigation>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Tasks
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-blue-600 dark:text-blue-400"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">142</div>
                    <p className="text-xs text-blue-600/80 dark:text-blue-400/80">
                      +10.1% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/20 border-emerald-200 dark:border-emerald-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Completed Tasks
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">78</div>
                    <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80">
                      +12.5% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Team Members
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-purple-600 dark:text-purple-400"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">12</div>
                    <p className="text-xs text-purple-600/80 dark:text-purple-400/80">
                      +2 from last month
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/20 border-amber-200 dark:border-amber-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Task Completion Rate
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-amber-600 dark:text-amber-400"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">54.8%</div>
                    <p className="text-xs text-amber-600/80 dark:text-amber-400/80">
                      +8.2% from last month
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-full md:col-span-4">
                  <CardHeader>
                    <CardTitle>AI-Powered Insights</CardTitle>
                    <CardDescription>
                      AI analysis of your project performance and team productivity
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <AIInsights />
                  </CardContent>
                </Card>
                
                <Card className="col-span-full md:col-span-3">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle className="text-lg">Recent Activities</CardTitle>
                      <CardDescription>
                        The latest team activities and task updates
                      </CardDescription>
                    </div>
                    <Clock size={18} className="text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activities.map((activity) => (
                        <div 
                          key={activity.id} 
                          className={cn(
                            "p-3 rounded-lg border-l-4 transition-all shadow-sm hover:shadow-md",
                            getActivityCardClass(activity.type)
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className={cn("h-8 w-8 ring-2 ring-white", activity.user.color)}>
                              <div className="flex items-center justify-center w-full h-full text-xs font-medium text-white">
                                {activity.user.initials}
                              </div>
                            </Avatar>
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-1.5">
                                {getActivityIcon(activity.type)}
                                <p className="text-sm font-medium line-clamp-1">
                                  <span className="font-semibold">{activity.user.name}</span> {activity.action} <span className="font-medium">"{activity.item}"</span>{activity.suffix ? ` ${activity.suffix}` : ''}
                                </p>
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock size={12} className="mr-1" />
                                {activity.time}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-center">
                    <Button variant="outline" size="sm">View All Activities</Button>
                  </CardFooter>
                </Card>
              </div>
            </ChartNavigation>
          </TabsContent>
          
          <TabsContent value="team" className="space-y-4">
            <ChartNavigation>
              <div className="grid gap-6 md:grid-cols-2 mb-6">
                <Card className="overflow-hidden border-amber-200 dark:border-amber-800">
                  <CardHeader className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-800/30">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 dark:bg-amber-800/30 p-2 rounded-full">
                        <Calendar className="h-5 w-5 text-amber-700 dark:text-amber-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-amber-800 dark:text-amber-400">Team Productivity Trends</CardTitle>
                        <CardDescription>Monthly task completion metrics</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="h-[300px] flex flex-col">
                      <div className="flex justify-between mb-4">
                        <div className="space-y-1">
                          <div className="text-2xl font-bold">85</div>
                          <div className="text-xs text-muted-foreground">Avg. Tasks/Month</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-2xl font-bold">16</div>
                          <div className="text-xs text-muted-foreground">Avg. Meetings/Month</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-2xl font-bold">+12%</div>
                          <div className="text-xs text-muted-foreground">Productivity Growth</div>
                        </div>
                      </div>
                      
                      <div className="flex-1 flex items-end space-x-2">
                        {productivityData.map((item) => (
                          <div key={item.month} className="flex-1 flex flex-col items-center">
                            <div className="w-full flex flex-col items-center space-y-1">
                              <div className="w-full bg-blue-100 dark:bg-blue-900/20 rounded-t-sm" 
                                style={{ height: `${item.tasks * 0.8}px` }} />
                              <div className="w-full bg-purple-100 dark:bg-purple-900/20 rounded-t-sm" 
                                style={{ height: `${item.meetings * 2}px` }} />
                            </div>
                            <div className="text-xs text-muted-foreground mt-2">{item.month}</div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-center space-x-5 mt-4">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-blue-100 dark:bg-blue-900/20 mr-2"></div>
                          <span className="text-xs">Tasks</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-purple-100 dark:bg-purple-900/20 mr-2"></div>
                          <span className="text-xs">Meetings</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden border-purple-200 dark:border-purple-800">
                  <CardHeader className="bg-purple-50 dark:bg-purple-900/20 border-b border-purple-100 dark:border-purple-800/30">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 dark:bg-purple-800/30 p-2 rounded-full">
                        <Zap className="h-5 w-5 text-purple-700 dark:text-purple-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-purple-800 dark:text-purple-400">Staff Performance</CardTitle>
                        <CardDescription>Individual contribution metrics</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <div className="text-sm font-medium">Sarah Johnson</div>
                            <div className="text-sm font-semibold">96%</div>
                          </div>
                          <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: '96%' }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <div className="text-sm font-medium">Mike Anderson</div>
                            <div className="text-sm font-semibold">82%</div>
                          </div>
                          <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: '82%' }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <div className="text-sm font-medium">Emily Chen</div>
                            <div className="text-sm font-semibold">91%</div>
                          </div>
                          <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: '91%' }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <div className="text-sm font-medium">Alex Thompson</div>
                            <div className="text-sm font-semibold">75%</div>
                          </div>
                          <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: '75%' }}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-medium mb-4">Project Progress</h4>
                        <div className="space-y-4">
                          {projectStatus.map((project) => (
                            <div key={project.name} className="space-y-2">
                              <div className="flex justify-between">
                                <div className="text-sm">{project.name}</div>
                                <div className="text-sm font-medium">{project.progress}%</div>
                              </div>
                              <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                                <div className={`h-full ${project.color} rounded-full`} style={{ width: `${project.progress}%` }}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="border-green-200 dark:border-green-800 overflow-hidden">
                <CardHeader className="bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-800/30">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 dark:bg-green-800/30 p-2 rounded-full">
                      <Users className="h-5 w-5 text-green-700 dark:text-green-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-green-800 dark:text-green-400">Departmental Performance</CardTitle>
                      <CardDescription>Efficiency metrics by department</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center p-4 border rounded-lg bg-green-50/50 dark:bg-green-900/10">
                      <div className="text-xl font-bold text-green-700 dark:text-green-400 mb-1">Marketing</div>
                      <div className="text-3xl font-bold">87%</div>
                      <div className="text-sm text-muted-foreground mb-4">Completion Rate</div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '87%' }}></div>
                      </div>
                      <div className="mt-4 text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp size={14} className="text-green-500" />
                          <span>+12% from previous quarter</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-900/10">
                      <div className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-1">Engineering</div>
                      <div className="text-3xl font-bold">92%</div>
                      <div className="text-sm text-muted-foreground mb-4">Completion Rate</div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                      <div className="mt-4 text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp size={14} className="text-green-500" />
                          <span>+8% from previous quarter</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center p-4 border rounded-lg bg-purple-50/50 dark:bg-purple-900/10">
                      <div className="text-xl font-bold text-purple-700 dark:text-purple-400 mb-1">Design</div>
                      <div className="text-3xl font-bold">78%</div>
                      <div className="text-sm text-muted-foreground mb-4">Completion Rate</div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                      <div className="mt-4 text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp size={14} className="text-green-500" />
                          <span>+5% from previous quarter</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <TeamPerformanceChart />
            </ChartNavigation>
          </TabsContent>
          
          <TabsContent value="tasks" className="space-y-4">
            <ChartNavigation>
              <TaskDistributionChart />
            </ChartNavigation>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
};

export default Reports;

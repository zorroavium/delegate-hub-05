
import React from 'react';
import { SidebarLayout } from '@/components/layout/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  ActivitySquare
} from 'lucide-react';

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

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
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
                            "p-3 rounded-lg border-l-4 transition-all",
                            getActivityCardClass(activity.type)
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className={cn("h-8 w-8", activity.user.color)}>
                              <div className="flex items-center justify-center w-full h-full text-xs font-medium text-white">
                                {activity.user.initials}
                              </div>
                            </Avatar>
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-1.5">
                                {getActivityIcon(activity.type)}
                                <p className="text-sm font-medium line-clamp-1">
                                  <span className="font-semibold">{activity.user.name}</span> {activity.action} "{activity.item}"{activity.suffix ? ` ${activity.suffix}` : ''}
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
                </Card>
              </div>
            </ChartNavigation>
          </TabsContent>
          
          <TabsContent value="team" className="space-y-4">
            <ChartNavigation>
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


import React, { useState } from 'react';
import { SidebarLayout } from '@/components/layout/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Bell, CheckCheck, Clock, User, Calendar, CheckSquare, Info, AlertTriangle } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

// Sample notification data
const sampleNotifications = [
  {
    id: 1,
    type: 'task',
    title: 'New Task Assigned',
    message: 'You have been assigned a new task: "Update product documentation"',
    time: '2 hours ago',
    read: false,
    priority: 'medium',
    icon: <CheckSquare className="h-5 w-5" />
  },
  {
    id: 2,
    type: 'reminder',
    title: 'Task Due Soon',
    message: 'The task "Quarterly report" is due in 2 days',
    time: '5 hours ago',
    read: true,
    priority: 'high',
    icon: <Clock className="h-5 w-5" />
  },
  {
    id: 3,
    type: 'system',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur on April 20, 2025 at 2:00 AM',
    time: '1 day ago',
    read: false,
    priority: 'low',
    icon: <Info className="h-5 w-5" />
  },
  {
    id: 4,
    type: 'user',
    title: 'Profile Update',
    message: 'John Doe has updated their profile information',
    time: '2 days ago',
    read: true,
    priority: 'low',
    icon: <User className="h-5 w-5" />
  },
  {
    id: 5,
    type: 'calendar',
    title: 'Meeting Reminder',
    message: 'Team meeting scheduled for tomorrow at 10:00 AM',
    time: '2 days ago',
    read: false,
    priority: 'medium',
    icon: <Calendar className="h-5 w-5" />
  },
  {
    id: 6,
    type: 'system',
    title: 'System Alert',
    message: 'Server usage has exceeded 80% capacity',
    time: '3 days ago',
    read: false,
    priority: 'high',
    icon: <AlertTriangle className="h-5 w-5" />
  }
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [activeTab, setActiveTab] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;
  
  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === activeTab);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast({
      title: "Notifications marked as read",
      description: "All notifications have been marked as read"
    });
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast({
      title: "Notifications cleared",
      description: "All notifications have been removed"
    });
  };

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="default">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return null;
    }
  };

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-primary" variant="default">
                {unreadCount} New
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={markAllAsRead} 
              disabled={unreadCount === 0}
            >
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearAllNotifications}
              disabled={notifications.length === 0}
            >
              Clear all
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all" className="flex gap-2">
              <Bell className="h-4 w-4" />
              All
              {unreadCount > 0 && (
                <Badge variant="default" className="ml-1 bg-primary">{unreadCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="task" className="flex gap-2">
              <CheckSquare className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="reminder" className="flex gap-2">
              <Clock className="h-4 w-4" />
              Reminders
            </TabsTrigger>
            <TabsTrigger value="system" className="flex gap-2">
              <Info className="h-4 w-4" />
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Bell className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-lg font-medium">No notifications</p>
                  <p className="text-sm text-muted-foreground">
                    {activeTab === 'all' 
                      ? "You don't have any notifications at the moment." 
                      : `You don't have any ${activeTab} notifications at the moment.`}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <Card 
                    key={notification.id} 
                    className={`transition-all ${!notification.read ? 'border-l-4 border-l-primary' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 rounded-full p-2 ${!notification.read ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          {notification.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold flex items-center gap-2">
                              {notification.title}
                              {getPriorityBadge(notification.priority)}
                            </h3>
                            <span className="text-xs text-muted-foreground">
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                          {!notification.read && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="mt-2 h-8 text-xs"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
};

export default NotificationsPage;


import React, { useState, useEffect } from 'react';
import { SidebarLayout } from '@/components/layout/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Moon, Sun, User, Shield, Globe, Mail, MessageSquare, Workflow, Settings2 } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { TaskStatusSettings } from '@/components/settings/task-status-settings';
import { EmployeeManagement } from '@/components/settings/employee-management';
import { ThemeSettings } from '@/components/settings/theme-settings';
import { z } from 'zod';

// Validation schema for profile form
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  department: z.string().min(1, "Department is required"),
});

// Validation schema for password form
const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const SettingsPage = () => {
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'manager',
    department: 'operations'
  });
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  // Notification states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(false);
  const [taskAssignedNotifs, setTaskAssignedNotifs] = useState(true);
  const [taskStatusNotifs, setTaskStatusNotifs] = useState(true);
  const [taskDueNotifs, setTaskDueNotifs] = useState(true);
  const [commentsNotifs, setCommentsNotifs] = useState(true);

  // Integration states
  const [integrations, setIntegrations] = useState({
    googleCalendar: false,
    slack: false,
    trello: false
  });

  // Handle profile form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle select changes for profile
  const handleProfileSelectChange = (name: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle password form changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save profile information
  const handleSaveProfile = () => {
    try {
      profileSchema.parse(profileData);
      setProfileErrors({});
      
      // In a real app, you would send this to an API
      // For now, just show a success toast
      localStorage.setItem('profileData', JSON.stringify(profileData));
      
      toast({
        title: "Profile saved",
        description: "Your profile information has been updated successfully."
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setProfileErrors(newErrors);
        
        toast({
          title: "Error saving profile",
          description: "Please check the form for errors",
          variant: "destructive"
        });
      }
    }
  };

  // Update password
  const handleUpdatePassword = () => {
    try {
      passwordSchema.parse(passwordData);
      setPasswordErrors({});
      
      // In a real app, you would verify the current password and update with new one
      // For now, just show a success toast and reset the form
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully."
      });
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setPasswordErrors(newErrors);
        
        toast({
          title: "Error updating password",
          description: "Please check the form for errors",
          variant: "destructive"
        });
      }
    }
  };

  // Save notification settings
  const handleSaveNotifications = () => {
    // Store notification preferences in localStorage
    const notificationSettings = {
      email: emailNotifications,
      push: pushNotifications,
      whatsapp: whatsappNotifications,
      taskAssigned: taskAssignedNotifs,
      taskStatus: taskStatusNotifs,
      taskDue: taskDueNotifs,
      comments: commentsNotifs
    };
    
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
    
    toast({
      title: "Notification settings saved",
      description: "Your notification preferences have been updated successfully."
    });
  };
  
  // Connect integration
  const handleConnectIntegration = (integration: 'googleCalendar' | 'slack' | 'trello') => {
    setIntegrations(prev => ({
      ...prev,
      [integration]: !prev[integration]
    }));
    
    const status = !integrations[integration] ? 'connected' : 'disconnected';
    const integrationNames = {
      googleCalendar: 'Google Calendar',
      slack: 'Slack',
      trello: 'Trello'
    };
    
    toast({
      title: `Integration ${status}`,
      description: `${integrationNames[integration]} has been ${status} successfully.`
    });
  };

  // Load saved settings from localStorage on initial render
  useEffect(() => {
    // Load profile data
    const savedProfileData = localStorage.getItem('profileData');
    if (savedProfileData) {
      setProfileData(JSON.parse(savedProfileData));
    }
    
    // Load notification settings
    const savedNotificationSettings = localStorage.getItem('notificationSettings');
    if (savedNotificationSettings) {
      const settings = JSON.parse(savedNotificationSettings);
      setEmailNotifications(settings.email);
      setPushNotifications(settings.push);
      setWhatsappNotifications(settings.whatsapp);
      setTaskAssignedNotifs(settings.taskAssigned);
      setTaskStatusNotifs(settings.taskStatus);
      setTaskDueNotifs(settings.taskDue);
      setCommentsNotifs(settings.comments);
    }
    
    // Load integration settings
    const savedIntegrations = localStorage.getItem('integrations');
    if (savedIntegrations) {
      setIntegrations(JSON.parse(savedIntegrations));
    }
  }, []);

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        </div>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-4 md:grid-cols-8 h-auto gap-0">
            <TabsTrigger value="general" className="flex items-center gap-2 px-4 py-2">
            <Settings2 size={16} />
              <span className="hidden md:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2 px-4 py-2">
              <Bell size={16} />
              <span className="hidden md:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2 px-4 py-2">
              <Sun size={16} />
              <span className="hidden md:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="workflow" className="flex items-center gap-2 px-4 py-2">
              <Workflow size={16} />
              <span className="hidden md:inline">Workflow</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2 px-4 py-2">
              <Shield size={16} />
              <span className="hidden md:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2 px-4 py-2">
              <Globe size={16} />
              <span className="hidden md:inline">Integrations</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your account details and preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        name="name"
                        value={profileData.name} 
                        onChange={handleProfileChange}
                        className={profileErrors.name ? "border-red-500" : ""}
                      />
                      {profileErrors.name && <p className="text-red-500 text-xs mt-1">{profileErrors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email"
                        value={profileData.email} 
                        onChange={handleProfileChange}
                        type="email"
                        className={profileErrors.email ? "border-red-500" : ""}
                      />
                      {profileErrors.email && <p className="text-red-500 text-xs mt-1">{profileErrors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select 
                        value={profileData.role}
                        onValueChange={(value) => handleProfileSelectChange('role', value)}
                      >
                        <SelectTrigger 
                          id="role"
                          className={profileErrors.role ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="employee">Employee</SelectItem>
                          <SelectItem value="admin">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                      {profileErrors.role && <p className="text-red-500 text-xs mt-1">{profileErrors.role}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select 
                        value={profileData.department}
                        onValueChange={(value) => handleProfileSelectChange('department', value)}
                      >
                        <SelectTrigger 
                          id="department"
                          className={profileErrors.department ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="operations">Operations</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="development">Development</SelectItem>
                          <SelectItem value="hr">Human Resources</SelectItem>
                        </SelectContent>
                      </Select>
                      {profileErrors.department && <p className="text-red-500 text-xs mt-1">{profileErrors.department}</p>}
                    </div>
                  </div>
                  <Button className="mt-4" onClick={handleSaveProfile}>Save Changes</Button>
                </div>
                </CardContent>
              </Card>

              <Separator />
   
              <EmployeeManagement />
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Configure how and when you receive notifications.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail size={20} />
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell size={20} />
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={pushNotifications}
                        onCheckedChange={setPushNotifications}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MessageSquare size={20} />
                        <Label htmlFor="whatsapp-notifications">WhatsApp Notifications</Label>
                      </div>
                      <Switch
                        id="whatsapp-notifications"
                        checked={whatsappNotifications}
                        onCheckedChange={setWhatsappNotifications}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notification Types</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="task-assigned" 
                          checked={taskAssignedNotifs}
                          onCheckedChange={setTaskAssignedNotifs}
                        />
                        <Label htmlFor="task-assigned">Task Assignment</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="task-status" 
                          checked={taskStatusNotifs}
                          onCheckedChange={setTaskStatusNotifs}
                        />
                        <Label htmlFor="task-status">Task Status Changes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="task-due" 
                          checked={taskDueNotifs}
                          onCheckedChange={setTaskDueNotifs}
                        />
                        <Label htmlFor="task-due">Task Due Date Reminders</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="comments" 
                          checked={commentsNotifs}
                          onCheckedChange={setCommentsNotifs}
                        />
                        <Label htmlFor="comments">Comments & Mentions</Label>
                      </div>
                    </div>
                  </div>
                  
                  <Button onClick={handleSaveNotifications}>Save Preferences</Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>
                    Customize the look and feel of your application.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ThemeSettings />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="workflow" className="mt-6 space-y-6">
              <TaskStatusSettings />
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security and authentication methods.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Change Password</h3>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input 
                          id="current-password" 
                          name="currentPassword"
                          type="password" 
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className={passwordErrors.currentPassword ? "border-red-500" : ""}
                        />
                        {passwordErrors.currentPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.currentPassword}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input 
                          id="new-password" 
                          name="newPassword"
                          type="password" 
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className={passwordErrors.newPassword ? "border-red-500" : ""}
                        />
                        {passwordErrors.newPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input 
                          id="confirm-password" 
                          name="confirmPassword"
                          type="password" 
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className={passwordErrors.confirmPassword ? "border-red-500" : ""}
                        />
                        {passwordErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword}</p>}
                      </div>
                    </div>
                    <Button onClick={handleUpdatePassword}>Update Password</Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account by enabling two-factor authentication.
                    </p>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="integrations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Integrations</CardTitle>
                  <CardDescription>
                    Connect with other tools and services to enhance your workflow.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-md bg-blue-100 flex items-center justify-center">
                          <Mail className="text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-base font-medium">Google Calendar</h4>
                          <p className="text-sm text-muted-foreground">Sync your tasks with Google Calendar</p>
                        </div>
                      </div>
                      <Button 
                        variant={integrations.googleCalendar ? "default" : "outline"}
                        onClick={() => handleConnectIntegration('googleCalendar')}
                      >
                        {integrations.googleCalendar ? 'Disconnect' : 'Connect'}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-md bg-green-100 flex items-center justify-center">
                          <MessageSquare className="text-green-600" />
                        </div>
                        <div>
                          <h4 className="text-base font-medium">Slack</h4>
                          <p className="text-sm text-muted-foreground">Get notifications in your Slack channels</p>
                        </div>
                      </div>
                      <Button 
                        variant={integrations.slack ? "default" : "outline"}
                        onClick={() => handleConnectIntegration('slack')}
                      >
                        {integrations.slack ? 'Disconnect' : 'Connect'}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-md bg-purple-100 flex items-center justify-center">
                          <Globe className="text-purple-600" />
                        </div>
                        <div>
                          <h4 className="text-base font-medium">Trello</h4>
                          <p className="text-sm text-muted-foreground">Import boards and tasks from Trello</p>
                        </div>
                      </div>
                      <Button 
                        variant={integrations.trello ? "default" : "outline"}
                        onClick={() => handleConnectIntegration('trello')}
                      >
                        {integrations.trello ? 'Disconnect' : 'Connect'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </SidebarLayout>
  );
};

export default SettingsPage;

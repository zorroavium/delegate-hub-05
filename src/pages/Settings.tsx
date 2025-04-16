import React, { useState, useEffect } from 'react';
import { SidebarLayout } from '@/components/layout/sidebar';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Bell, 
  Moon, 
  Sun, 
  User, 
  Shield, 
  Globe, 
  Mail, 
  MessageSquare, 
  Workflow, 
  Settings2,
  MailPlus,
  Calendar as CalendarIcon,
  Github,
  Gitlab,
  FileCode,
  Bot,
  Slack,
  Image,
  Sparkles,
  Trello,
  Chrome,
  Twitter,
  FileText,
  ToggleLeft,
  CreditCard,
  Webhook,
  BarChart,
  Figma,
  Database
} from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { TaskStatusSettings } from '@/components/settings/task-status-settings';
import { EmployeeManagement } from '@/components/settings/employee-management';
import { ThemeSettings } from '@/components/settings/theme-settings';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  department: z.string().min(1, "Department is required"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const SettingsPage = () => {
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'manager',
    department: 'operations'
  });
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(false);
  const [taskAssignedNotifs, setTaskAssignedNotifs] = useState(true);
  const [taskStatusNotifs, setTaskStatusNotifs] = useState(true);
  const [taskDueNotifs, setTaskDueNotifs] = useState(true);
  const [commentsNotifs, setCommentsNotifs] = useState(true);

  const [integrations, setIntegrations] = useState({
    googleCalendar: false,
    slack: false,
    trello: false,
    github: false,
    gitlab: false,
    figma: false,
    zapier: false,
    stripe: false,
    twitter: false,
    googleDrive: false,
    microsoftTeams: false,
    asana: false,
    adobeCreativeCloud: false,
    dropbox: false,
    zoom: false,
    mailchimp: false,
    jira: false,
    salesforce: false,
    hubspot: false,
    openai: false,
    chrome: false
  });

  const [zapierWebhook, setZapierWebhook] = useState('');
  const [stripePublicKey, setStripePublicKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSelectChange = (name: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    try {
      profileSchema.parse(profileData);
      setProfileErrors({});
      
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

  const handleUpdatePassword = () => {
    try {
      passwordSchema.parse(passwordData);
      setPasswordErrors({});
      
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

  const handleSaveNotifications = () => {
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

  const handleConnectIntegration = (integration: keyof typeof integrations) => {
    setIntegrations(prev => ({
      ...prev,
      [integration]: !prev[integration]
    }));
    
    const status = !integrations[integration] ? 'connected' : 'disconnected';
    const integrationNames: Record<string, string> = {
      googleCalendar: 'Google Calendar',
      slack: 'Slack',
      trello: 'Trello',
      github: 'GitHub',
      gitlab: 'GitLab',
      figma: 'Figma',
      zapier: 'Zapier',
      stripe: 'Stripe',
      twitter: 'Twitter',
      googleDrive: 'Google Drive',
      microsoftTeams: 'Microsoft Teams',
      asana: 'Asana',
      adobeCreativeCloud: 'Adobe Creative Cloud',
      dropbox: 'Dropbox',
      zoom: 'Zoom',
      mailchimp: 'Mailchimp',
      jira: 'Jira',
      salesforce: 'Salesforce',
      hubspot: 'HubSpot',
      openai: 'OpenAI'
    };
    
    toast({
      title: `Integration ${status}`,
      description: `${integrationNames[integration]} has been ${status} successfully.`
    });
  };

  const saveApiKey = (type: string) => {
    let message = '';
    switch (type) {
      case 'zapier':
        message = 'Zapier webhook URL saved';
        break;
      case 'stripe':
        message = 'Stripe API key saved';
        break;
      case 'openai':
        message = 'OpenAI API key saved';
        break;
    }

    toast({
      title: "API Key Saved",
      description: message
    });
  };

  useEffect(() => {
    const savedProfileData = localStorage.getItem('profileData');
    if (savedProfileData) {
      setProfileData(JSON.parse(savedProfileData));
    }
    
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
    
    const savedIntegrations = localStorage.getItem('integrations');
    if (savedIntegrations) {
      setIntegrations(JSON.parse(savedIntegrations));
    }
  }, []);

  return (
    <ProtectedRoute suppressSecurityNotice={true}>
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
                  <ThemeSettings />
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
                  <CardContent>
                    <Tabs defaultValue="productivity" className="w-full">
                      <TabsList className="grid grid-cols-4 mb-4">
                        <TabsTrigger value="productivity">Productivity</TabsTrigger>
                        <TabsTrigger value="development">Development</TabsTrigger>
                        <TabsTrigger value="marketing">Marketing</TabsTrigger>
                        <TabsTrigger value="ai">AI & Automation</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="productivity" className="space-y-6">
                        <div className="grid gap-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-md bg-blue-100 flex items-center justify-center dark:bg-blue-900/50">
                                <CalendarIcon className="text-blue-600 dark:text-blue-400" />
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
                              <div className="w-12 h-12 rounded-md bg-green-100 flex items-center justify-center dark:bg-green-900/50">
                                <Slack className="text-green-600 dark:text-green-400" />
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
                              <div className="w-12 h-12 rounded-md bg-blue-100 flex items-center justify-center dark:bg-blue-900/50">
                                <Trello className="text-blue-600 dark:text-blue-400" />
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
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-md bg-purple-100 flex items-center justify-center dark:bg-purple-900/50">
                                <MessageSquare className="text-purple-600 dark:text-purple-400" />
                              </div>
                              <div>
                                <h4 className="text-base font-medium">Microsoft Teams</h4>
                                <p className="text-sm text-muted-foreground">Share tasks and updates in Teams</p>
                              </div>
                            </div>
                            <Button 
                              variant={integrations.microsoftTeams ? "default" : "outline"}
                              onClick={() => handleConnectIntegration('microsoftTeams')}
                            >
                              {integrations.microsoftTeams ? 'Disconnect' : 'Connect'}
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-md bg-yellow-100 flex items-center justify-center dark:bg-yellow-900/50">
                                <FileText className="text-yellow-600 dark:text-yellow-400" />
                              </div>
                              <div>
                                <h4 className="text-base font-medium">Google Drive</h4>
                                <p className="text-sm text-muted-foreground">Attach files from Google Drive</p>
                              </div>
                            </div>
                            <Button 
                              variant={integrations.googleDrive ? "default" : "outline"}
                              onClick={() => handleConnectIntegration('googleDrive')}
                            >
                              {integrations.googleDrive ? 'Disconnect' : 'Connect'}
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="development" className="space-y-6">
                        <div className="grid gap-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center dark:bg-gray-800/50">
                                <Github className="text-gray-800 dark:text-gray-300" />
                              </div>
                              <div>
                                <h4 className="text-base font-medium">GitHub</h4>
                                <p className="text-sm text-muted-foreground">Link tasks to GitHub issues and PRs</p>
                              </div>
                            </div>
                            <Button 
                              variant={integrations.github ? "default" : "outline"}
                              onClick={() => handleConnectIntegration('github')}
                            >
                              {integrations.github ? 'Disconnect' : 'Connect'}
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-md bg-orange-100 flex items-center justify-center dark:bg-orange-900/50">
                                <Gitlab className="text-orange-600 dark:text-orange-400" />
                              </div>
                              <div>
                                <h4 className="text-base font-medium">GitLab</h4>
                                <p className="text-sm text-muted-foreground">Connect tasks with GitLab issues</p>
                              </div>
                            </div>
                            <Button 
                              variant={integrations.gitlab ? "default" : "outline"}
                              onClick={() => handleConnectIntegration('gitlab')}
                            >
                              {integrations.gitlab ? 'Disconnect' : 'Connect'}
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-md bg-blue-100 flex items-center justify-center dark:bg-blue-900/50">
                                <FileCode className="text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <h4 className="text-base font-medium">Jira</h4>
                                <p className="text-sm text-muted-foreground">Two-way sync with Jira tickets</p>
                              </div>
                            </div>
                            <Button 
                              variant={integrations.jira ? "default" : "outline"}
                              onClick={() => handleConnectIntegration('jira')}
                            >
                              {integrations.jira ? 'Disconnect' : 'Connect'}
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-md bg-purple-100 flex items-center justify-center dark:bg-purple-900/50">
                                <Figma className="text-purple-600 dark:text-purple-400" />
                              </div>
                              <div>
                                <h4 className="text-base font-medium">Figma</h4>
                                <p className="text-sm text-muted-foreground">Embed Figma designs in tasks</p>
                              </div>
                            </div>
                            <Button 
                              variant={integrations.figma ? "default" : "outline"}
                              onClick={() => handleConnectIntegration('figma')}
                            >
                              {integrations.figma ? 'Disconnect' : 'Connect'}
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="marketing" className="space-y-6">
                        <div className="grid gap-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-md bg-blue-100 flex items-center justify-center dark:bg-blue-900/50">
                                <Twitter className="text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <h4 className="text-base font-medium">Twitter</h4>
                                <p className="text-sm text-muted-foreground">Schedule tweets and monitor mentions</p>
                              </div>
                            </div>
                            <Button 
                              variant={integrations.twitter ? "default" : "outline"}
                              onClick={() => handleConnectIntegration('twitter')}
                            >
                              {integrations.twitter ? 'Disconnect' : 'Connect'}
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-md bg-yellow-100 flex items-center justify-center dark:bg-yellow-900/50">
                                <MailPlus className="text-yellow-600 dark:text-yellow-400" />
                              </div>
                              <div>
                                <h4 className="text-base font-medium">Mailchimp</h4>
                                <p className="text-sm text-muted-foreground">Manage email campaigns from tasks</p>
                              </div>
                            </div>
                            <Button 
                              variant={integrations.mailchimp ? "default" : "outline"}
                              onClick={() => handleConnectIntegration('mailchimp')}
                            >
                              {integrations.mailchimp ? 'Disconnect' : 'Connect'}
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-md bg-orange-100 flex items-center justify-center dark:bg-orange-900/50">
                                <Database className="text-orange-600 dark:text-orange-400" />
                              </div>
                              <div>
                                <h4 className="text-base font-medium">HubSpot</h4>
                                <p className="text-sm text-muted-foreground">Connect leads and contacts to tasks</p>
                              </div>
                            </div>
                            <Button 
                              variant={integrations.hubspot ? "default" : "outline"}
                              onClick={() => handleConnectIntegration('hubspot')}
                            >
                              {integrations.hubspot ? 'Disconnect' : 'Connect'}
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-md bg-blue-100 flex items-center justify-center dark:bg-blue-900/50">
                                <BarChart className="text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <h4 className="text-base font-medium">Salesforce</h4>
                                <p className="text-sm text-muted-foreground">Link opportunities with your tasks</p>
                              </div>
                            </div>
                            <Button 
                              variant={integrations.salesforce ? "default" : "outline"}
                              onClick={() => handleConnectIntegration('salesforce')}
                            >
                              {integrations.salesforce ? 'Disconnect' : 'Connect'}
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="ai" className="space-y-6">
                        <div className="grid gap-6">
                          <div className="flex flex-col space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-md bg-orange-100 flex items-center justify-center dark:bg-orange-900/50">
                                  <Webhook className="text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                  <h4 className="text-base font-medium">Zapier</h4>
                                  <p className="text-sm text-muted-foreground">Automate workflows with Zapier</p>
                                </div>
                              </div>
                              <Button 
                                variant={integrations.zapier ? "default" : "outline"}
                                onClick={() => handleConnectIntegration('zapier')}
                              >
                                {integrations.zapier ? 'Disconnect' : 'Connect'}
                              </Button>
                            </div>
                            {integrations.zapier && (
                              <div className="ml-16 space-y-2">
                                <Label htmlFor="zapier-webhook">Zapier Webhook URL</Label>
                                <div className="flex space-x-2">
                                  <Input 
                                    id="zapier-webhook" 
                                    placeholder="https://hooks.zapier.com/..." 
                                    value={zapierWebhook}
                                    onChange={(e) => setZapierWebhook(e.target.value)}
                                  />
                                  <Button onClick={() => saveApiKey('zapier')}>Save</Button>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-md bg-purple-100 flex items-center justify-center dark:bg-purple-900/50">
                                  <CreditCard className="text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                  <h4 className="text-base font-medium">Stripe</h4>
                                  <p className="text-sm text-muted-foreground">Track payments and subscriptions</p>
                                </div>
                              </div>
                              <Button 
                                variant={integrations.stripe ? "default" : "outline"}
                                onClick={() => handleConnectIntegration('stripe')}
                              >
                                {integrations.stripe ? 'Disconnect' : 'Connect'}
                              </Button>
                            </div>
                            {integrations.stripe && (
                              <div className="ml-16 space-y-2">
                                <Label htmlFor="stripe-key">Stripe Public Key</Label>
                                <div className="flex space-x-2">
                                  <Input 
                                    id="stripe-key" 
                                    placeholder="pk_..." 
                                    value={stripePublicKey}
                                    onChange={(e) => setStripePublicKey(e.target.value)}
                                  />
                                  <Button onClick={() => saveApiKey('stripe')}>Save</Button>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-md bg-green-100 flex items-center justify-center dark:bg-green-900/50">
                                  <Sparkles className="text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                  <h4 className="text-base font-medium">OpenAI</h4>
                                  <p className="text-sm text-muted-foreground">Generate content and summaries</p>
                                </div>
                              </div>
                              <Button 
                                variant={integrations.openai ? "default" : "outline"}
                                onClick={() => handleConnectIntegration('openai')}
                              >
                                {integrations.openai ? 'Disconnect' : 'Connect'}
                              </Button>
                            </div>
                            {integrations.openai && (
                              <div className="ml-16 space-y-2">
                                <Label htmlFor="openai-key">OpenAI API Key</Label>
                                <div className="flex space-x-2">
                                  <Input 
                                    id="openai-key" 
                                    placeholder="sk-..." 
                                    type="password"
                                    value={openaiKey}
                                    onChange={(e) => setOpenaiKey(e.target.value)}
                                  />
                                  <Button onClick={() => saveApiKey('openai')}>Save</Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-5">
                    <div className="text-sm text-muted-foreground">
                      <p>Need help setting up integrations?</p>
                      <a href="#" className="text-primary hover:underline">View the documentation</a>
                    </div>
                    <Button variant="outline">Check for Updates</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </SidebarLayout>
    </ProtectedRoute>
  );
};

export default SettingsPage;

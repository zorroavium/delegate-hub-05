
import React, { useState } from 'react';
import { SidebarLayout } from '@/components/layout/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Moon, Sun, User, Shield, Globe, Mail, MessageSquare } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(false);
  
  const handleSaveNotifications = () => {
    toast({
      title: "Notification settings saved",
      description: "Your notification preferences have been updated successfully."
    });
  };

  const handleSaveAppearance = () => {
    toast({
      title: "Appearance settings saved",
      description: `Dark mode has been ${darkMode ? 'enabled' : 'disabled'}.`
    });
  };

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-4 md:grid-cols-5 h-auto gap-4">
            <TabsTrigger value="profile" className="flex items-center gap-2 px-4 py-2">
              <User size={16} />
              <span className="hidden md:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2 px-4 py-2">
              <Bell size={16} />
              <span className="hidden md:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2 px-4 py-2">
              <Sun size={16} />
              <span className="hidden md:inline">Appearance</span>
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
            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your account details and preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" defaultValue="john.doe@example.com" type="email" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select defaultValue="manager">
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="employee">Employee</SelectItem>
                          <SelectItem value="admin">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select defaultValue="operations">
                        <SelectTrigger id="department">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="operations">Operations</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="development">Development</SelectItem>
                          <SelectItem value="hr">Human Resources</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="mt-4">Save Changes</Button>
                </CardContent>
              </Card>
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
                        <Switch id="task-assigned" defaultChecked />
                        <Label htmlFor="task-assigned">Task Assignment</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="task-status" defaultChecked />
                        <Label htmlFor="task-status">Task Status Changes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="task-due" defaultChecked />
                        <Label htmlFor="task-due">Task Due Date Reminders</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="comments" defaultChecked />
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
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Moon size={20} className={!darkMode ? "text-muted-foreground" : ""} />
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                    </div>
                    <Switch
                      id="dark-mode"
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Theme Colors</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-blue-500 cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-blue-500"></div>
                        <span className="text-sm">Blue</span>
                      </div>
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-purple-500 cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-purple-500"></div>
                        <span className="text-sm">Purple</span>
                      </div>
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-green-500 cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-green-500"></div>
                        <span className="text-sm">Green</span>
                      </div>
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-orange-500 cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-orange-500"></div>
                        <span className="text-sm">Orange</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button onClick={handleSaveAppearance}>Save Appearance</Button>
                </CardContent>
              </Card>
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
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                    </div>
                    <Button>Update Password</Button>
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
                      <Button variant="outline">Connect</Button>
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
                      <Button variant="outline">Connect</Button>
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
                      <Button variant="outline">Connect</Button>
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

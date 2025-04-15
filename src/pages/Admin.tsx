import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { SidebarLayout } from '@/components/layout/sidebar';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { UserRoleManagement } from '@/components/admin/user-role-management';
import { AuditLog } from '@/components/admin/audit-log';
import { DataExport } from '@/components/admin/data-export';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, 
  Users, 
  Settings, 
  Database, 
  FileDigit, 
  Sliders, 
  Globe, 
  Workflow,
  Bell,
  BarChart,
  HardDrive
} from 'lucide-react';
import { PasswordChangeDialog } from '@/components/auth/password-change-dialog';
import { Button } from '@/components/ui/button';

export default function Admin() {
  const { user } = useAuth();
  const [passwordChangeOpen, setPasswordChangeOpen] = useState(false);

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <SidebarLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage users, permissions, and system settings
              </p>
            </div>
            <Button onClick={() => setPasswordChangeOpen(true)}>
              Change Password
            </Button>
          </div>
          
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="h-auto p-1 flex-wrap">
              <TabsTrigger value="users" className="flex items-center gap-2 h-9 px-4">
                <Users className="h-4 w-4" />
                <span>Users</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2 h-9 px-4">
                <Shield className="h-4 w-4" />
                <span>Security</span>
              </TabsTrigger>
              <TabsTrigger value="data" className="flex items-center gap-2 h-9 px-4">
                <Database className="h-4 w-4" />
                <span>Data Management</span>
              </TabsTrigger>
              <TabsTrigger value="integrations" className="flex items-center gap-2 h-9 px-4">
                <Workflow className="h-4 w-4" />
                <span>Integrations</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2 h-9 px-4">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="space-y-6">
              <UserRoleManagement />
            </TabsContent>
            
            <TabsContent value="security" className="space-y-6">
              <AuditLog />
              
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Configure system-wide security policies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" />
                          Password Policy
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <ul className="space-y-2 list-disc list-inside">
                          <li>Minimum length: 8 characters</li>
                          <li>Require uppercase letters</li>
                          <li>Require lowercase letters</li>
                          <li>Require numbers</li>
                          <li>Require special characters</li>
                          <li>Password expiry: 90 days</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Sliders className="h-4 w-4 text-primary" />
                          Session Management
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <ul className="space-y-2 list-disc list-inside">
                          <li>Session timeout: 30 minutes</li>
                          <li>Max concurrent sessions: 5</li>
                          <li>Remember me duration: 30 days</li>
                          <li>Enforce IP validation: Enabled</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Bell className="h-4 w-4 text-primary" />
                          Login Notifications
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <ul className="space-y-2 list-disc list-inside">
                          <li>Failed login alerts: Enabled</li>
                          <li>New device login: Enabled</li>
                          <li>Unusual activity detection: Enabled</li>
                          <li>Admin login notifications: Enabled</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="data" className="space-y-6">
              <DataExport />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5 text-primary" />
                    Database Management
                  </CardTitle>
                  <CardDescription>
                    Configure database settings and maintenance tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <BarChart className="h-4 w-4 text-primary" />
                          Database Statistics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span>Total Users:</span>
                          <span className="font-medium">{123}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Tasks:</span>
                          <span className="font-medium">{456}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Database Size:</span>
                          <span className="font-medium">24.6 MB</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Backup:</span>
                          <span className="font-medium">6 hours ago</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <FileDigit className="h-4 w-4 text-primary" />
                          Data Retention Policy
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <ul className="space-y-2 list-disc list-inside">
                          <li>Audit logs: 90 days</li>
                          <li>System backups: 30 days</li>
                          <li>Deleted items: 30 days</li>
                          <li>User activity logs: 180 days</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="integrations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    External Integrations
                  </CardTitle>
                  <CardDescription>
                    Connect with third-party services and APIs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure and manage connections to external services.
                  </p>
                  <div className="grid gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Email Service</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p>SMTP Server: smtp.example.com</p>
                            <p className="text-muted-foreground">Used for sending notifications and password resets</p>
                          </div>
                          <Button variant="outline" size="sm">Configure</Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Single Sign-On (SSO)</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p>Status: Not configured</p>
                            <p className="text-muted-foreground">Set up SAML or OpenID Connect</p>
                          </div>
                          <Button variant="outline" size="sm">Set Up</Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">API Access</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p>2 API keys active</p>
                            <p className="text-muted-foreground">Last used: 3 days ago</p>
                          </div>
                          <Button variant="outline" size="sm">Manage Keys</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>
                    Configure global admin settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Customization</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p className="text-muted-foreground">
                          Configure branding, logos, and UI themes
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">Customize</Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Notifications</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p className="text-muted-foreground">
                          Configure system and user notifications
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">Configure</Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Localization</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p className="text-muted-foreground">
                          Language, date formats, and regional settings
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">Configure</Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Workflow</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p className="text-muted-foreground">
                          Configure task statuses and workflows
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">Configure</Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Compliance</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p className="text-muted-foreground">
                          GDPR, privacy, and regulatory settings
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">Configure</Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">System Logs</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p className="text-muted-foreground">
                          View technical logs and diagnostics
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">View Logs</Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <PasswordChangeDialog 
          open={passwordChangeOpen} 
          onOpenChange={setPasswordChangeOpen} 
        />
      </SidebarLayout>
    </ProtectedRoute>
  );
}


import React, { useState } from 'react';
import { Download, FileJson, FileText, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Export history type
type ExportHistoryItem = {
  id: string;
  timestamp: string;
  type: 'full' | 'users' | 'tasks' | 'custom';
  format: 'csv' | 'json';
  status: 'completed' | 'failed';
  downloadUrl?: string;
  size?: string;
  error?: string;
};

export function DataExport() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('export');
  const [exportType, setExportType] = useState('full');
  const [exportFormat, setExportFormat] = useState('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportHistory, setExportHistory] = useState<ExportHistoryItem[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'full',
      format: 'csv',
      status: 'completed',
      downloadUrl: '#',
      size: '2.4 MB',
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'users',
      format: 'json',
      status: 'completed',
      downloadUrl: '#',
      size: '145 KB',
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'tasks',
      format: 'csv',
      status: 'failed',
      error: 'Timeout during export process',
    },
  ]);

  // Form for custom export
  const form = useForm({
    defaultValues: {
      users: true,
      tasks: true,
      employees: true,
      settings: false,
      auditLogs: false,
    },
  });

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'yyyy-MM-dd HH:mm');
    } catch (error) {
      return timestamp;
    }
  };

  // Handle export
  const handleExport = () => {
    setIsExporting(true);
    setExportProgress(0);
    
    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 10);
        if (next >= 100) {
          clearInterval(interval);
          
          // Add to history
          const newExport: ExportHistoryItem = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            type: exportType as any,
            format: exportFormat as any,
            status: 'completed',
            downloadUrl: '#',
            size: exportType === 'full' ? '3.2 MB' : exportType === 'users' ? '120 KB' : '1.5 MB',
          };
          
          setExportHistory([newExport, ...exportHistory]);
          
          setTimeout(() => {
            setIsExporting(false);
            toast({
              title: 'Export completed',
              description: 'Your data has been exported successfully and is ready for download.',
            });
          }, 500);
          
          return 100;
        }
        return next;
      });
    }, 300);
  };

  // Handle custom export
  const handleCustomExport = (values: any) => {
    setIsExporting(true);
    setExportProgress(0);
    
    // Get selected export options
    const selectedOptions = Object.entries(values)
      .filter(([_, checked]) => checked)
      .map(([key]) => key);
    
    if (selectedOptions.length === 0) {
      toast({
        title: 'Export failed',
        description: 'Please select at least one data type to export.',
        variant: 'destructive',
      });
      setIsExporting(false);
      return;
    }
    
    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 15);
        if (next >= 100) {
          clearInterval(interval);
          
          // Add to history
          const newExport: ExportHistoryItem = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            type: 'custom',
            format: exportFormat as any,
            status: 'completed',
            downloadUrl: '#',
            size: `${(selectedOptions.length * 0.5).toFixed(1)} MB`,
          };
          
          setExportHistory([newExport, ...exportHistory]);
          
          setTimeout(() => {
            setIsExporting(false);
            toast({
              title: 'Custom export completed',
              description: `Your custom data (${selectedOptions.join(', ')}) has been exported successfully.`,
            });
          }, 500);
          
          return 100;
        }
        return next;
      });
    }, 300);
  };

  // Render export type label
  const renderExportTypeLabel = (type: string) => {
    switch (type) {
      case 'full':
        return 'Full Database';
      case 'users':
        return 'Users Only';
      case 'tasks':
        return 'Tasks Only';
      case 'custom':
        return 'Custom Export';
      default:
        return type;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          Data Export & Backup
        </CardTitle>
        <CardDescription>
          Export your data in various formats for backup or analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="export">Export Data</TabsTrigger>
            <TabsTrigger value="history">Export History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="export">
            <div className="space-y-6">
              {isExporting ? (
                <div className="space-y-4 rounded-lg border p-6">
                  <div className="text-center">
                    <h3 className="text-lg font-medium">Exporting data...</h3>
                    <p className="text-sm text-muted-foreground">Please wait while we prepare your export</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{exportProgress}%</span>
                    </div>
                    <Progress value={exportProgress} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2 pt-2">
                    <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      This may take a few minutes depending on the size of your data
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-4 rounded-lg border p-6">
                    <h3 className="text-lg font-medium">Quick Export</h3>
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium">Export Type</label>
                        <Select value={exportType} onValueChange={setExportType}>
                          <SelectTrigger className="mt-1.5">
                            <SelectValue placeholder="Select export type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full">Full Database Export</SelectItem>
                            <SelectItem value="users">Users Only</SelectItem>
                            <SelectItem value="tasks">Tasks Only</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="mt-1.5 text-xs text-muted-foreground">
                          Select what data you want to export
                        </p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Export Format</label>
                        <Select value={exportFormat} onValueChange={setExportFormat}>
                          <SelectTrigger className="mt-1.5">
                            <SelectValue placeholder="Select export format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="csv">CSV Format</SelectItem>
                            <SelectItem value="json">JSON Format</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="mt-1.5 text-xs text-muted-foreground">
                          Choose the file format for your export
                        </p>
                      </div>
                    </div>
                    
                    <Button onClick={handleExport} className="mt-2">
                      <Download className="mr-2 h-4 w-4" />
                      Start Export
                    </Button>
                  </div>
                  
                  <div className="space-y-4 rounded-lg border p-6">
                    <h3 className="text-lg font-medium">Custom Export</h3>
                    <p className="text-sm text-muted-foreground">
                      Select specific data types to include in your export
                    </p>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleCustomExport)} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="users"
                            render={({ field }) => (
                              <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="font-medium">Users & Accounts</FormLabel>
                                  <FormDescription>
                                    User profiles, roles, and permissions
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="tasks"
                            render={({ field }) => (
                              <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="font-medium">Tasks & Projects</FormLabel>
                                  <FormDescription>
                                    All tasks, project data, and assignments
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="employees"
                            render={({ field }) => (
                              <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="font-medium">Employee Data</FormLabel>
                                  <FormDescription>
                                    Employee profiles and performance data
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="settings"
                            render={({ field }) => (
                              <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="font-medium">System Settings</FormLabel>
                                  <FormDescription>
                                    Application configuration and preferences
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="auditLogs"
                            render={({ field }) => (
                              <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="font-medium">Audit Logs</FormLabel>
                                  <FormDescription>
                                    Security and activity logs
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Select value={exportFormat} onValueChange={setExportFormat}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select export format" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="csv">CSV Format</SelectItem>
                              <SelectItem value="json">JSON Format</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Button type="submit">
                            <Download className="mr-2 h-4 w-4" />
                            Export Selected Data
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                  
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Important Notice</AlertTitle>
                    <AlertDescription>
                      Exported data may contain sensitive information. Always store your exports securely and in compliance with data protection regulations.
                    </AlertDescription>
                  </Alert>
                </>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <div className="space-y-4">
              {exportHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Download className="h-10 w-10 text-muted-foreground/60" />
                  <h3 className="mt-4 text-lg font-medium">No export history</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You haven't exported any data yet. Go to the Export tab to get started.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <div className="grid grid-cols-[1fr,auto,auto,auto,auto] gap-4 p-4 font-medium border-b">
                    <div>Export Details</div>
                    <div>Type</div>
                    <div>Format</div>
                    <div>Status</div>
                    <div></div>
                  </div>
                  
                  {exportHistory.map((item) => (
                    <div key={item.id} className="grid grid-cols-[1fr,auto,auto,auto,auto] items-center gap-4 p-4 border-b last:border-0">
                      <div>
                        <div className="font-medium">{formatTimestamp(item.timestamp)}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.size && `Size: ${item.size}`}
                        </div>
                      </div>
                      
                      <div>
                        {renderExportTypeLabel(item.type)}
                      </div>
                      
                      <div>
                        <Badge variant="outline" className="uppercase">
                          {item.format === 'csv' ? (
                            <FileText className="mr-1 h-3 w-3" />
                          ) : (
                            <FileJson className="mr-1 h-3 w-3" />
                          )}
                          {item.format}
                        </Badge>
                      </div>
                      
                      <div>
                        {item.status === 'completed' ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Completed
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900">
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            Failed
                          </Badge>
                        )}
                      </div>
                      
                      <div>
                        {item.status === 'completed' && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={item.downloadUrl} download>
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t p-4 text-sm text-muted-foreground">
        Automatic backups are performed daily and retained for 30 days.
      </CardFooter>
    </Card>
  );
}

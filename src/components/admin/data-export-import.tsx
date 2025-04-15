
import React, { useState } from 'react';
import { 
  Download, 
  Upload, 
  FileText, 
  Table as TableIcon, 
  Check, 
  Calendar, 
  Users, 
  Settings, 
  ChevronDown,
  FileJson,
  FileCsv,
  FileSpreadsheet,
  Loader2
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Mock export API
const mockExportApi = {
  exportUsers: async (format: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return 'mock_users_data_url';
  },
  
  exportTasks: async (format: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return 'mock_tasks_data_url';
  },
  
  exportAuditLog: async (format: string, fromDate?: Date, toDate?: Date): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 2500));
    return 'mock_audit_log_data_url';
  },
  
  validateImportFile: async (file: File): Promise<{
    valid: boolean;
    records: number;
    errors?: string[];
  }> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate validation
    if (file.name.includes('invalid')) {
      return {
        valid: false,
        records: 0,
        errors: [
          'Invalid file format',
          'Missing required columns',
          'Data type mismatch in row 3'
        ]
      };
    }
    
    return {
      valid: true,
      records: Math.floor(Math.random() * 100) + 10,
    };
  },
  
  importData: async (file: File, entity: string, options: any): Promise<{
    success: boolean;
    processed: number;
    created: number;
    updated: number;
    skipped: number;
    errors?: string[];
  }> => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate import results
    if (file.name.includes('error')) {
      return {
        success: false,
        processed: 20,
        created: 5,
        updated: 8,
        skipped: 2,
        errors: [
          'Error processing row 10: Invalid email format',
          'Error processing row 15: Duplicate entry'
        ]
      };
    }
    
    return {
      success: true,
      processed: Math.floor(Math.random() * 100) + 20,
      created: Math.floor(Math.random() * 50),
      updated: Math.floor(Math.random() * 30),
      skipped: Math.floor(Math.random() * 10),
    };
  }
};

// Export settings interface
interface ExportSettings {
  format: 'csv' | 'json' | 'xlsx';
  dateRange?: {
    from: Date | null;
    to: Date | null;
  };
  filters?: Record<string, any>;
  includeDeleted?: boolean;
}

// Import settings interface
interface ImportSettings {
  entity: 'users' | 'tasks' | 'settings';
  updateExisting: boolean;
  skipErrors: boolean;
  dryRun: boolean;
}

// Main component
export function DataExportImport() {
  const { toast } = useToast();
  const { hasPermission } = useAuth();
  const [exportType, setExportType] = useState<string | null>(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'xlsx'>('csv');
  const [exportProgress, setExportProgress] = useState(0);
  const [exportLoading, setExportLoading] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importSettings, setImportSettings] = useState<ImportSettings>({
    entity: 'users',
    updateExisting: true,
    skipErrors: false,
    dryRun: true,
  });
  const [importValidating, setImportValidating] = useState(false);
  const [importValidation, setImportValidation] = useState<{
    valid: boolean;
    records: number;
    errors?: string[];
  } | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    processed: number;
    created: number;
    updated: number;
    skipped: number;
    errors?: string[];
  } | null>(null);
  
  // Handle export dialog open
  const handleExportDialogOpen = (type: string) => {
    setExportType(type);
    setExportDialogOpen(true);
    setExportProgress(0);
    setExportLoading(false);
  };
  
  // Handle export
  const handleExport = async () => {
    setExportLoading(true);
    setExportProgress(0);
    
    try {
      let exportUrl = '';
      
      // Progress simulation
      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          const newValue = prev + Math.random() * 15;
          return newValue < 90 ? newValue : prev;
        });
      }, 300);
      
      // Perform export based on type
      switch (exportType) {
        case 'users':
          exportUrl = await mockExportApi.exportUsers(exportFormat);
          break;
        case 'tasks':
          exportUrl = await mockExportApi.exportTasks(exportFormat);
          break;
        case 'audit':
          exportUrl = await mockExportApi.exportAuditLog(exportFormat);
          break;
        default:
          throw new Error('Invalid export type');
      }
      
      clearInterval(progressInterval);
      setExportProgress(100);
      
      // Simulate download
      toast({
        title: 'Export successful',
        description: `${exportType.charAt(0).toUpperCase() + exportType.slice(1)} data has been exported successfully.`,
      });
      
      // Close dialog after a short delay
      setTimeout(() => {
        setExportDialogOpen(false);
      }, 1500);
      
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'There was an error exporting the data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setExportLoading(false);
    }
  };
  
  // Handle file change for import
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (files && files.length > 0) {
      const file = files[0];
      setImportFile(file);
      setImportValidation(null);
      setImportResult(null);
      
      setImportValidating(true);
      
      try {
        const validation = await mockExportApi.validateImportFile(file);
        setImportValidation(validation);
      } catch (error) {
        toast({
          title: 'Validation failed',
          description: 'There was an error validating the import file.',
          variant: 'destructive',
        });
        setImportValidation({
          valid: false,
          records: 0,
          errors: ['Failed to validate file']
        });
      } finally {
        setImportValidating(false);
      }
    }
  };
  
  // Handle import
  const handleImport = async () => {
    if (!importFile) return;
    
    setImportLoading(true);
    setImportProgress(0);
    setImportResult(null);
    
    try {
      // Progress simulation
      const progressInterval = setInterval(() => {
        setImportProgress(prev => {
          const newValue = prev + Math.random() * 10;
          return newValue < 90 ? newValue : prev;
        });
      }, 300);
      
      // Perform import
      const result = await mockExportApi.importData(
        importFile,
        importSettings.entity,
        {
          updateExisting: importSettings.updateExisting,
          skipErrors: importSettings.skipErrors,
          dryRun: importSettings.dryRun,
        }
      );
      
      clearInterval(progressInterval);
      setImportProgress(100);
      setImportResult(result);
      
      if (result.success) {
        toast({
          title: importSettings.dryRun ? 'Dry run completed' : 'Import successful',
          description: `${result.processed} records processed, ${result.created} created, ${result.updated} updated`,
        });
      } else {
        toast({
          title: 'Import completed with errors',
          description: 'Some records could not be imported. See the details in the import dialog.',
          variant: 'destructive',
        });
      }
      
    } catch (error) {
      toast({
        title: 'Import failed',
        description: 'There was an error importing the data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setImportLoading(false);
    }
  };
  
  // Reset import form
  const resetImportForm = () => {
    setImportFile(null);
    setImportValidation(null);
    setImportResult(null);
    setImportProgress(0);
    
    // Reset file input
    const fileInput = document.getElementById('import-file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Data Management</CardTitle>
        <CardDescription>Export and import system data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Export Section */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Export Data</CardTitle>
              <CardDescription>
                Export data from the system in various formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-4">
                  Select the type of data you want to export. The data will be downloaded in the selected format.
                </p>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="users">
                    <AccordionTrigger className="text-base">
                      <div className="flex items-center">
                        <Users className="mr-2 h-5 w-5" />
                        Users & Accounts
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-2 pb-1">
                        <p className="text-sm text-muted-foreground mb-3">
                          Export user accounts, roles, and their associated settings.
                        </p>
                        <Button
                          onClick={() => handleExportDialogOpen('users')}
                          disabled={!hasPermission('exportData')}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Export Users
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="tasks">
                    <AccordionTrigger className="text-base">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-5 w-5" />
                        Tasks & Activities
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-2 pb-1">
                        <p className="text-sm text-muted-foreground mb-3">
                          Export tasks, assignments, comments, and statuses.
                        </p>
                        <Button
                          onClick={() => handleExportDialogOpen('tasks')}
                          disabled={!hasPermission('exportData')}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Export Tasks
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="settings">
                    <AccordionTrigger className="text-base">
                      <div className="flex items-center">
                        <Settings className="mr-2 h-5 w-5" />
                        System Settings
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-2 pb-1">
                        <p className="text-sm text-muted-foreground mb-3">
                          Export system configurations, workflows, and templates.
                        </p>
                        <Button
                          onClick={() => handleExportDialogOpen('settings')}
                          disabled={!hasPermission('exportData')}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Export Settings
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="audit">
                    <AccordionTrigger className="text-base">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-5 w-5" />
                        Audit Logs
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-2 pb-1">
                        <p className="text-sm text-muted-foreground mb-3">
                          Export security audit logs, user activity, and system events.
                        </p>
                        <Button
                          onClick={() => handleExportDialogOpen('audit')}
                          disabled={!hasPermission('auditLog')}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Export Audit Logs
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CardContent>
          </Card>
          
          {/* Import Section */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Import Data</CardTitle>
              <CardDescription>
                Import data into the system from external sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-4">
                  Import data from CSV, JSON, or Excel files. The system will validate the data before importing.
                </p>
                
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <Button
                      onClick={() => setImportDialogOpen(true)}
                      disabled={!hasPermission('importData')}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Users className="mr-2 h-5 w-5" />
                      Import Users
                    </Button>
                    
                    <Button
                      onClick={() => setImportDialogOpen(true)}
                      disabled={!hasPermission('importData')}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <FileText className="mr-2 h-5 w-5" />
                      Import Tasks
                    </Button>
                    
                    <Button
                      onClick={() => setImportDialogOpen(true)}
                      disabled={!hasPermission('importData')}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Settings className="mr-2 h-5 w-5" />
                      Import Settings
                    </Button>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <h4 className="text-sm font-medium">Download Templates</h4>
                    <p className="text-xs text-muted-foreground mt-1 mb-2">
                      Download template files to ensure your import data is properly formatted.
                    </p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" />
                          Download Template
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Select template type</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex items-center">
                          <FileCsv className="mr-2 h-4 w-4" />
                          User Import Template (CSV)
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center">
                          <FileJson className="mr-2 h-4 w-4" />
                          User Import Template (JSON)
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center">
                          <FileSpreadsheet className="mr-2 h-4 w-4" />
                          User Import Template (Excel)
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex items-center">
                          <FileCsv className="mr-2 h-4 w-4" />
                          Task Import Template (CSV)
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center">
                          <FileSpreadsheet className="mr-2 h-4 w-4" />
                          Task Import Template (Excel)
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Data is exported and imported securely. All operations are logged in the audit trail.
        </p>
      </CardFooter>
      
      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Export {exportType ? exportType.charAt(0).toUpperCase() + exportType.slice(1) : 'Data'}
            </DialogTitle>
            <DialogDescription>
              Configure your export settings and download the data.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Export Format</h4>
              <Tabs defaultValue="csv" onValueChange={(v) => setExportFormat(v as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="csv" className="flex items-center">
                    <FileCsv className="mr-2 h-4 w-4" />
                    CSV
                  </TabsTrigger>
                  <TabsTrigger value="json" className="flex items-center">
                    <FileJson className="mr-2 h-4 w-4" />
                    JSON
                  </TabsTrigger>
                  <TabsTrigger value="xlsx" className="flex items-center">
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Excel
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {exportType === 'audit' && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Date Range</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs" htmlFor="from-date">From Date</label>
                    <Input id="from-date" type="date" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs" htmlFor="to-date">To Date</label>
                    <Input id="to-date" type="date" />
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Export Options</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-deleted" />
                  <label
                    htmlFor="include-deleted"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Include deleted items
                  </label>
                </div>
                {exportType === 'users' && (
                  <div className="flex items-center space-x-2">
                    <Checkbox id="include-security" />
                    <label
                      htmlFor="include-security"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Include security information
                    </label>
                  </div>
                )}
                {exportType === 'tasks' && (
                  <div className="flex items-center space-x-2">
                    <Checkbox id="include-comments" defaultChecked />
                    <label
                      htmlFor="include-comments"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Include comments and activity
                    </label>
                  </div>
                )}
              </div>
            </div>
            
            {exportLoading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Export progress</span>
                  <span>{Math.round(exportProgress)}%</span>
                </div>
                <Progress value={exportProgress} className="h-2" />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setExportDialogOpen(false)}
              disabled={exportLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={exportLoading}
            >
              {exportLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Import Data</DialogTitle>
            <DialogDescription>
              Upload a file to import data into the system.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload & Validate</TabsTrigger>
              <TabsTrigger value="import" disabled={!importValidation?.valid}>Import</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-4 py-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Data Type</h4>
                <Select
                  defaultValue={importSettings.entity}
                  onValueChange={(value) => setImportSettings({...importSettings, entity: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select data type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="users">Users & Accounts</SelectItem>
                    <SelectItem value="tasks">Tasks & Activities</SelectItem>
                    <SelectItem value="settings">System Settings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">File Upload</h4>
                <div className="rounded-md border border-dashed p-6 text-center">
                  <Input
                    id="import-file"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".csv,.json,.xlsx,.xls"
                    disabled={importValidating}
                  />
                  {importFile ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center">
                        {(() => {
                          const ext = importFile.name.split('.').pop()?.toLowerCase();
                          if (ext === 'csv') return <FileCsv className="h-8 w-8 text-muted-foreground" />;
                          if (ext === 'json') return <FileJson className="h-8 w-8 text-muted-foreground" />;
                          if (ext === 'xlsx' || ext === 'xls') return <FileSpreadsheet className="h-8 w-8 text-muted-foreground" />;
                          return <FileText className="h-8 w-8 text-muted-foreground" />;
                        })()}
                      </div>
                      <p className="text-sm font-medium">{importFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(importFile.size / 1024).toFixed(1)} KB
                      </p>
                      
                      {importValidating ? (
                        <div className="flex items-center justify-center space-x-2 mt-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Validating file...</span>
                        </div>
                      ) : (
                        <div className="flex justify-center mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={resetImportForm}
                          >
                            Change File
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <label
                      htmlFor="import-file"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      <span className="text-sm font-medium">Click to upload</span>
                      <span className="text-xs text-muted-foreground mt-1">
                        CSV, JSON, or Excel files
                      </span>
                    </label>
                  )}
                </div>
              </div>
              
              {importValidation && (
                <div className="space-y-2 border rounded-md p-4">
                  <h4 className="text-sm font-medium flex items-center">
                    {importValidation.valid ? (
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                    )}
                    Validation Results
                  </h4>
                  
                  {importValidation.valid ? (
                    <div className="text-sm">
                      <p className="text-green-600 font-medium">
                        File is valid and ready for import.
                      </p>
                      <p className="mt-1">
                        Found {importValidation.records} records to import.
                      </p>
                    </div>
                  ) : (
                    <div className="text-sm">
                      <p className="text-red-600 font-medium">
                        File validation failed.
                      </p>
                      {importValidation.errors && (
                        <ul className="list-disc pl-5 mt-1 space-y-1 text-xs">
                          {importValidation.errors.map((error, index) => (
                            <li key={index} className="text-red-600">{error}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="import" className="space-y-4 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Import Options</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="update-existing"
                        checked={importSettings.updateExisting}
                        onCheckedChange={(checked) => 
                          setImportSettings({...importSettings, updateExisting: !!checked})
                        }
                      />
                      <label
                        htmlFor="update-existing"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Update existing records
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="skip-errors"
                        checked={importSettings.skipErrors}
                        onCheckedChange={(checked) => 
                          setImportSettings({...importSettings, skipErrors: !!checked})
                        }
                      />
                      <label
                        htmlFor="skip-errors"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Skip records with errors
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="dry-run"
                        checked={importSettings.dryRun}
                        onCheckedChange={(checked) => 
                          setImportSettings({...importSettings, dryRun: !!checked})
                        }
                      />
                      <label
                        htmlFor="dry-run"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Perform dry run (validate without saving)
                      </label>
                    </div>
                  </div>
                </div>
                
                {importLoading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Import progress</span>
                      <span>{Math.round(importProgress)}%</span>
                    </div>
                    <Progress value={importProgress} className="h-2" />
                  </div>
                )}
                
                {importResult && (
                  <Alert variant={importResult.success ? "default" : "destructive"} className="mt-4">
                    <AlertTitle>{importResult.success ? "Import completed" : "Import completed with errors"}</AlertTitle>
                    <AlertDescription>
                      <div className="space-y-2 text-sm">
                        <p>
                          Processed: {importResult.processed} records
                        </p>
                        <p>
                          Created: {importResult.created} | Updated: {importResult.updated} | Skipped: {importResult.skipped}
                        </p>
                        
                        {!importResult.success && importResult.errors && (
                          <div className="mt-2">
                            <p className="font-medium">Errors:</p>
                            <ul className="list-disc pl-5 mt-1 space-y-1 text-xs">
                              {importResult.errors.map((error, index) => (
                                <li key={index}>{error}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setImportDialogOpen(false);
                resetImportForm();
              }}
              disabled={importLoading}
            >
              Close
            </Button>
            
            {importValidation?.valid && !importResult && (
              <Button
                onClick={handleImport}
                disabled={importLoading || !importValidation?.valid}
              >
                {importLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {importSettings.dryRun ? 'Simulating...' : 'Importing...'}
                  </>
                ) : (
                  <>
                    {importSettings.dryRun ? 'Run Simulation' : 'Import Data'}
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

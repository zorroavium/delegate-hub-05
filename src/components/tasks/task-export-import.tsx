
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useTaskStore } from '@/store/useTaskStore';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function TaskExportImport() {
  const { exportTasks, importTasks } = useTaskStore();
  const { toast } = useToast();
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleExport = () => {
    const jsonData = exportTasks();
    
    // Create and download the file
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export successful",
      description: "Your tasks have been exported to a JSON file."
    });
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const jsonData = event.target?.result as string;
        
        // Validate the JSON data
        const parsed = JSON.parse(jsonData);
        if (!parsed.tasks || !Array.isArray(parsed.tasks)) {
          setImportResult({
            success: false,
            message: "Invalid file format. The file must contain a 'tasks' array."
          });
          return;
        }
        
        // Import the data
        importTasks(jsonData);
        
        setImportResult({
          success: true,
          message: `Successfully imported ${parsed.tasks.length} tasks${parsed.templates ? ` and ${parsed.templates.length} templates` : ''}.`
        });
        
      } catch (error) {
        setImportResult({
          success: false,
          message: "Failed to import tasks. Please make sure the file contains valid JSON data."
        });
      }
    };
    
    reader.readAsText(file);
    setIsImportDialogOpen(true);
    
    // Reset file input
    e.target.value = '';
  };
  
  const closeImportDialog = () => {
    setIsImportDialogOpen(false);
    setTimeout(() => {
      setImportResult(null);
    }, 300);
  };
  
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Export & Import</CardTitle>
          <CardDescription>
            Back up your tasks or move them to another system
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <div className="flex space-x-4">
            <Button 
              onClick={handleExport} 
              className="flex-1 gap-2"
              variant="outline"
            >
              <Download size={16} />
              Export Tasks
            </Button>
            
            <Button 
              onClick={triggerFileInput} 
              className="flex-1 gap-2"
              variant="outline"
            >
              <Upload size={16} />
              Import Tasks
            </Button>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".json" 
              onChange={handleFileSelect}
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>• Export creates a JSON file with all your tasks and templates</p>
            <p>• Import allows restoring from a previously exported file</p>
            <p className="text-amber-500 dark:text-amber-400">Warning: Importing will overwrite all existing tasks</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Import Result Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={closeImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Result</DialogTitle>
            <DialogDescription>
              {importResult?.success 
                ? "Your tasks have been imported successfully." 
                : "There was an issue with the import."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 flex items-start space-x-3">
            {importResult?.success ? (
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            )}
            <p>{importResult?.message}</p>
          </div>
          
          <DialogFooter>
            <Button onClick={closeImportDialog}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

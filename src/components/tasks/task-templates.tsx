
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TaskTemplate, useTaskStore } from '@/store/useTaskStore';
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from '@/hooks/use-toast';
import { Check, Plus, Copy, FileText, Edit, Clock, Trash2 } from 'lucide-react';
import { useEmployeeStore } from '@/store/useEmployeeStore';

export function TaskTemplates() {
  const { toast } = useToast();
  const { templates, addTemplate, updateTemplate, deleteTemplate, createFromTemplate } = useTaskStore();
  const { employees } = useEmployeeStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUseTemplateDialogOpen, setIsUseTemplateDialogOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<TaskTemplate | null>(null);
  
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    tasks: []
  });
  
  const [templateUseData, setTemplateUseData] = useState({
    templateId: '',
    dueDate: '',
    assigneeId: ''
  });
  
  const handleCreateTemplate = () => {
    if (!newTemplate.name.trim()) {
      toast({
        title: "Error",
        description: "Template name is required",
        variant: "destructive"
      });
      return;
    }
    
    addTemplate(newTemplate);
    setNewTemplate({
      name: '',
      description: '',
      tasks: []
    });
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Template created",
      description: "Task template has been created successfully"
    });
  };
  
  const handleEditTemplate = () => {
    if (!currentTemplate) return;
    
    updateTemplate(currentTemplate.id, {
      name: currentTemplate.name,
      description: currentTemplate.description,
      tasks: currentTemplate.tasks
    });
    
    setIsEditDialogOpen(false);
    
    toast({
      title: "Template updated",
      description: "Task template has been updated successfully"
    });
  };
  
  const handleDeleteTemplate = (id: string) => {
    deleteTemplate(id);
    
    toast({
      title: "Template deleted",
      description: "Task template has been deleted"
    });
  };
  
  const handleUseTemplate = () => {
    const { templateId, dueDate, assigneeId } = templateUseData;
    
    if (!templateId || !dueDate || !assigneeId) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive"
      });
      return;
    }
    
    const newTaskId = createFromTemplate(templateId, dueDate, assigneeId);
    
    if (newTaskId) {
      toast({
        title: "Task created",
        description: "New task created from template"
      });
      
      setIsUseTemplateDialogOpen(false);
      setTemplateUseData({
        templateId: '',
        dueDate: '',
        assigneeId: ''
      });
    }
  };
  
  const openEditDialog = (template: TaskTemplate) => {
    setCurrentTemplate(template);
    setIsEditDialogOpen(true);
  };
  
  const openUseTemplateDialog = (templateId: string) => {
    setTemplateUseData({
      ...templateUseData,
      templateId
    });
    setIsUseTemplateDialogOpen(true);
  };
  
  // Get tomorrow's date for the due date default
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Task Templates</h2>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          size="sm"
          className="flex items-center gap-1"
        >
          <Plus size={16} />
          New Template
        </Button>
      </div>
      
      {templates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {templates.map(template => (
            <Card key={template.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {template.tasks.length} task(s) in template
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openEditDialog(template)}
                  className="gap-1"
                >
                  <Edit size={14} />
                  Edit
                </Button>
                <Button 
                  size="sm"
                  onClick={() => openUseTemplateDialog(template.id)}
                  className="gap-1"
                >
                  <Copy size={14} />
                  Use
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Templates Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create task templates to quickly start projects with predefined tasks.
            </p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="gap-1"
            >
              <Plus size={16} />
              Create Template
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* Create Template Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Create Task Template</DialogTitle>
          <DialogDescription>
            Create a reusable template for recurring workflows.
          </DialogDescription>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input 
                id="template-name" 
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                placeholder="e.g., New Employee Onboarding"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="template-description">Description</Label>
              <Textarea 
                id="template-description" 
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                placeholder="Describe what this template is for"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTemplate}>
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Template Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Edit Template</DialogTitle>
          <DialogDescription>
            Modify your task template.
          </DialogDescription>
          
          {currentTemplate && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-template-name">Template Name</Label>
                <Input 
                  id="edit-template-name" 
                  value={currentTemplate.name}
                  onChange={(e) => setCurrentTemplate({...currentTemplate, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-template-description">Description</Label>
                <Textarea 
                  id="edit-template-description" 
                  value={currentTemplate.description}
                  onChange={(e) => setCurrentTemplate({...currentTemplate, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => {
                    handleDeleteTemplate(currentTemplate.id);
                    setIsEditDialogOpen(false);
                  }}
                  className="gap-1"
                >
                  <Trash2 size={14} />
                  Delete
                </Button>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditTemplate}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Use Template Dialog */}
      <Dialog open={isUseTemplateDialogOpen} onOpenChange={setIsUseTemplateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Create from Template</DialogTitle>
          <DialogDescription>
            Create a new task using this template.
          </DialogDescription>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="template-due-date">Due Date</Label>
              <Input 
                id="template-due-date" 
                type="date"
                value={templateUseData.dueDate || getTomorrowDate()}
                onChange={(e) => setTemplateUseData({...templateUseData, dueDate: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="template-assignee">Assign To</Label>
              <Select 
                value={templateUseData.assigneeId}
                onValueChange={(value) => setTemplateUseData({...templateUseData, assigneeId: value})}
              >
                <SelectTrigger id="template-assignee">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(employee => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUseTemplateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUseTemplate}>
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

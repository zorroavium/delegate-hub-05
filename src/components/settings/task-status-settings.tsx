
import React, { useState } from 'react';
import { useStatusStore, StatusConfig } from '@/store/useStatusStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, GripVertical, Save, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Color options for task statuses with improved descriptions
const colorOptions = [
  { value: 'bg-status-pending', label: 'Amber', description: 'Good for pending or waiting tasks' },
  { value: 'bg-status-in-progress', label: 'Blue', description: 'Ideal for in-progress tasks' },
  { value: 'bg-status-completed', label: 'Green', description: 'Perfect for completed tasks' },
  { value: 'bg-status-delayed', label: 'Red', description: 'Best for delayed or blocked tasks' },
  { value: 'bg-purple-500', label: 'Purple', description: 'For review or quality assurance tasks' },
  { value: 'bg-pink-500', label: 'Pink', description: 'For high priority tasks' },
  { value: 'bg-indigo-500', label: 'Indigo', description: 'For planning or scheduled tasks' },
  { value: 'bg-cyan-500', label: 'Cyan', description: 'For tasks requiring input' },
  { value: 'bg-teal-500', label: 'Teal', description: 'For external dependencies' },
  { value: 'bg-orange-500', label: 'Orange', description: 'For tasks needing attention' },
];

export const TaskStatusSettings = () => {
  const { statuses, setStatuses, addStatus, updateStatus, removeStatus, reorderStatuses } = useStatusStore();
  const { toast } = useToast();
  const [newStatusName, setNewStatusName] = useState('');
  const [newStatusColor, setNewStatusColor] = useState(colorOptions[0].value);
  const [statusToDelete, setStatusToDelete] = useState<StatusConfig | null>(null);

  // Handle adding a new status
  const handleAddStatus = () => {
    if (!newStatusName.trim()) {
      toast({
        title: "Error",
        description: "Status name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    addStatus({
      name: newStatusName,
      color: newStatusColor,
    });

    // Reset form
    setNewStatusName('');
    setNewStatusColor(colorOptions[0].value);

    toast({
      title: "Status Added",
      description: `"${newStatusName}" status has been added`,
    });
  };

  // Handle status removal
  const handleRemoveStatus = (status: StatusConfig) => {
    setStatusToDelete(status);
  };

  // Confirm status deletion
  const confirmDelete = () => {
    if (statusToDelete) {
      removeStatus(statusToDelete.id);
      toast({
        title: "Status Removed",
        description: `"${statusToDelete.name}" status has been removed`,
      });
      setStatusToDelete(null);
    }
  };

  // Handle reordering of statuses
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    reorderStatuses(result.source.index, result.destination.index);
    
    toast({
      title: "Order Updated",
      description: "Status order has been updated successfully",
    });
  };

  // Sort statuses by order
  const sortedStatuses = [...statuses].sort((a, b) => a.order - b.order);

  // Find the description for a color
  const getColorDescription = (colorValue: string) => {
    const color = colorOptions.find(c => c.value === colorValue);
    return color?.description || '';
  };

  return (
    <Card className="shadow-md border-t-4 border-t-primary animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-xl">Task Statuses</span>
          <div className="flex gap-1 ml-2">
            {sortedStatuses.slice(0, 4).map((status) => (
              <div 
                key={status.id}
                className={cn("w-3 h-3 rounded-full", status.color)} 
                title={status.name}
              />
            ))}
          </div>
        </CardTitle>
        <CardDescription>
          Configure the statuses that tasks can have in your workflow. Drag to reorder them according to your process flow.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status List */}
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Drag to arrange in your preferred workflow order</h3>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="status-list">
            {(provided) => (
              <div 
                className="space-y-2" 
                {...provided.droppableProps} 
                ref={provided.innerRef}
              >
                {sortedStatuses.map((status, index) => (
                  <Draggable 
                    key={status.id} 
                    draggableId={status.id} 
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          "flex items-center gap-3 p-3 border rounded-md bg-background transition-all duration-200",
                          snapshot.isDragging ? "shadow-lg scale-[1.02] border-primary" : "hover:border-primary/50",
                        )}
                      >
                        <div 
                          {...provided.dragHandleProps}
                          className="cursor-grab text-muted-foreground hover:text-primary transition-colors"
                        >
                          <GripVertical size={18} />
                        </div>
                        
                        <div 
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110", 
                            status.color
                          )}
                          title={getColorDescription(status.color)}
                        >
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        
                        <Input 
                          value={status.name} 
                          onChange={(e) => updateStatus(status.id, { name: e.target.value })}
                          className="flex-1 border-muted"
                          placeholder="Status name"
                        />
                        
                        <select
                          value={status.color}
                          onChange={(e) => updateStatus(status.id, { color: e.target.value })}
                          className="px-2 py-1 border rounded-md h-10 text-sm focus:border-primary focus:ring-primary focus:ring-1 outline-none"
                          title={getColorDescription(status.color)}
                        >
                          {colorOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        
                        {statuses.length > 1 ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="hover:bg-red-50 hover:text-red-600 transition-colors"
                                onClick={() => handleRemoveStatus(status)}
                              >
                                <Trash2 size={18} className="text-muted-foreground hover:text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2">
                                  <AlertCircle className="h-5 w-5 text-destructive" />
                                  Delete Status
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the "{status.name}" status? This action cannot be undone,
                                  and tasks using this status will need to be reassigned.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={confirmDelete}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : (
                          <Button
                            variant="outline"
                            size="icon"
                            disabled
                            className="cursor-not-allowed opacity-50"
                            title="You need at least one status"
                          >
                            <Trash2 size={18} className="text-muted-foreground" />
                          </Button>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Add New Status Form */}
        <div className="pt-5 border-t mt-6">
          <h3 className="text-base font-medium mb-3">Add New Status</h3>
          <div className="flex items-center gap-3 bg-muted/30 p-3 rounded-lg border border-dashed">
            <div className={cn("w-6 h-6 rounded-full", newStatusColor)} />
            
            <Input
              placeholder="Enter status name..."
              value={newStatusName}
              onChange={(e) => setNewStatusName(e.target.value)}
              className="flex-1"
            />
            
            <select
              value={newStatusColor}
              onChange={(e) => setNewStatusColor(e.target.value)}
              className="px-2 py-1 border rounded-md h-10 focus:border-primary focus:ring-primary focus:ring-1 outline-none"
              title={getColorDescription(newStatusColor)}
            >
              {colorOptions.map((option) => (
                <option key={option.value} value={option.value} title={option.description}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <Button onClick={handleAddStatus} className="gap-1">
              <Plus size={16} />
              Add Status
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {getColorDescription(newStatusColor)}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4 mt-2">
        <p className="text-xs text-muted-foreground">
          {sortedStatuses.length} statuses configured
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs"
          onClick={() => {
            toast({
              title: "Settings Saved",
              description: "Your task status settings have been saved."
            });
          }}
        >
          <Save size={14} className="mr-1" />
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

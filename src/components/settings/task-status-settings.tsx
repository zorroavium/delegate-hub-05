
import React, { useState } from 'react';
import { useStatusStore, StatusConfig } from '@/store/useStatusStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, GripVertical, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

// Color options for task statuses
const colorOptions = [
  { value: 'bg-status-pending', label: 'Amber' },
  { value: 'bg-status-in-progress', label: 'Blue' },
  { value: 'bg-status-completed', label: 'Green' },
  { value: 'bg-status-delayed', label: 'Red' },
  { value: 'bg-purple-500', label: 'Purple' },
  { value: 'bg-pink-500', label: 'Pink' },
  { value: 'bg-indigo-500', label: 'Indigo' },
  { value: 'bg-cyan-500', label: 'Cyan' },
  { value: 'bg-teal-500', label: 'Teal' },
  { value: 'bg-orange-500', label: 'Orange' },
];

export const TaskStatusSettings = () => {
  const { statuses, setStatuses, addStatus, updateStatus, removeStatus, reorderStatuses } = useStatusStore();
  const { toast } = useToast();
  const [newStatusName, setNewStatusName] = useState('');
  const [newStatusColor, setNewStatusColor] = useState(colorOptions[0].value);

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
  const handleRemoveStatus = (id: string, name: string) => {
    removeStatus(id);
    toast({
      title: "Status Removed",
      description: `"${name}" status has been removed`,
    });
  };

  // Handle reordering of statuses
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    reorderStatuses(result.source.index, result.destination.index);
  };

  // Sort statuses by order
  const sortedStatuses = [...statuses].sort((a, b) => a.order - b.order);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Statuses</CardTitle>
        <CardDescription>
          Configure the statuses that tasks can have in your workflow. Drag to reorder.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status List */}
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
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex items-center gap-2 p-3 border rounded-md bg-background"
                      >
                        <div 
                          {...provided.dragHandleProps}
                          className="cursor-grab text-muted-foreground"
                        >
                          <GripVertical size={18} />
                        </div>
                        
                        <div className={cn("w-4 h-4 rounded-full", status.color)} />
                        
                        <Input 
                          value={status.name} 
                          onChange={(e) => updateStatus(status.id, { name: e.target.value })}
                          className="flex-1"
                        />
                        
                        <select
                          value={status.color}
                          onChange={(e) => updateStatus(status.id, { color: e.target.value })}
                          className="px-2 py-1 border rounded-md"
                        >
                          {colorOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleRemoveStatus(status.id, status.name)}
                          disabled={statuses.length <= 1}
                        >
                          <Trash2 size={18} className="text-destructive" />
                        </Button>
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
        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium mb-2">Add New Status</h3>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Status name"
              value={newStatusName}
              onChange={(e) => setNewStatusName(e.target.value)}
              className="flex-1"
            />
            
            <select
              value={newStatusColor}
              onChange={(e) => setNewStatusColor(e.target.value)}
              className="px-2 py-1 border rounded-md h-10"
            >
              {colorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <Button onClick={handleAddStatus}>
              <Plus size={18} className="mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

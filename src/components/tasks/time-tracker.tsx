
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { PlayCircle, StopCircle, Clock, Plus, Trash2, Edit2 } from 'lucide-react';
import { TaskTimeEntry } from '@/store/useTaskStore';
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceStrict } from 'date-fns';

interface TimeTrackerProps {
  taskId: string;
  timeEntries: TaskTimeEntry[];
  onStartTracking: (entry: Omit<TaskTimeEntry, 'id'>) => void;
  onStopTracking: (entryId: string) => void;
  onDeleteEntry: (entryId: string) => void;
  onUpdateEntry: (entryId: string, updates: Partial<TaskTimeEntry>) => void;
  className?: string;
}

export function TimeTracker({ 
  taskId, 
  timeEntries, 
  onStartTracking, 
  onStopTracking, 
  onDeleteEntry,
  onUpdateEntry,
  className 
}: TimeTrackerProps) {
  const [activeEntry, setActiveEntry] = useState<TaskTimeEntry | null>(null);
  const [elapsed, setElapsed] = useState<string>('00:00:00');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editEntryId, setEditEntryId] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState({
    hours: 0,
    minutes: 0,
    description: ''
  });
  
  // Find any active entry (no end time)
  useEffect(() => {
    const active = timeEntries.find(entry => !entry.ended);
    setActiveEntry(active || null);
  }, [timeEntries]);
  
  // Update elapsed time for active entry
  useEffect(() => {
    if (!activeEntry) {
      setElapsed('00:00:00');
      return;
    }
    
    const startTime = new Date(activeEntry.started).getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const elapsed = now - startTime;
      
      const hours = Math.floor(elapsed / (1000 * 60 * 60));
      const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
      
      setElapsed(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);
    
    return () => clearInterval(interval);
  }, [activeEntry]);
  
  const handleStartTracking = () => {
    const entry: Omit<TaskTimeEntry, 'id'> = {
      userId: '1', // This would be the current user's ID in a real implementation
      userName: 'Current User', // This would be the current user's name
      started: new Date().toISOString(),
      description: ''
    };
    
    onStartTracking(entry);
  };
  
  const handleStopTracking = () => {
    if (activeEntry) {
      onStopTracking(activeEntry.id);
    }
  };
  
  const handleAddManualEntry = () => {
    const { hours, minutes, description } = newEntry;
    
    // Calculate duration in seconds
    const duration = (hours * 60 * 60) + (minutes * 60);
    
    // Create end time based on start time + duration
    const started = new Date().toISOString();
    const endDate = new Date(new Date(started).getTime() + (duration * 1000));
    
    const entry: Omit<TaskTimeEntry, 'id'> = {
      userId: '1', // This would be the current user's ID
      userName: 'Current User', // This would be the current user's name
      started,
      ended: endDate.toISOString(),
      duration,
      description
    };
    
    onStartTracking(entry);
    
    // Reset form and close dialog
    setNewEntry({ hours: 0, minutes: 0, description: '' });
    setIsAddDialogOpen(false);
  };
  
  const handleEditEntry = (entry: TaskTimeEntry) => {
    setEditEntryId(entry.id);
    
    // Calculate hours and minutes from duration
    let hours = 0;
    let minutes = 0;
    
    if (entry.duration) {
      hours = Math.floor(entry.duration / 3600);
      minutes = Math.floor((entry.duration % 3600) / 60);
    } else if (entry.started && entry.ended) {
      const start = new Date(entry.started).getTime();
      const end = new Date(entry.ended).getTime();
      const durationMs = end - start;
      hours = Math.floor(durationMs / (1000 * 60 * 60));
      minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    }
    
    setNewEntry({
      hours,
      minutes,
      description: entry.description || ''
    });
    
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateEntry = () => {
    if (!editEntryId) return;
    
    const { hours, minutes, description } = newEntry;
    
    // Calculate duration in seconds
    const duration = (hours * 60 * 60) + (minutes * 60);
    
    // Find original entry to get started time
    const entry = timeEntries.find(e => e.id === editEntryId);
    if (!entry) return;
    
    // Create end time based on start time + duration
    const started = entry.started;
    const endDate = new Date(new Date(started).getTime() + (duration * 1000));
    
    onUpdateEntry(editEntryId, {
      ended: endDate.toISOString(),
      duration,
      description
    });
    
    // Reset form and close dialog
    setNewEntry({ hours: 0, minutes: 0, description: '' });
    setIsEditDialogOpen(false);
    setEditEntryId(null);
  };
  
  const formatDuration = (seconds?: number): string => {
    if (!seconds) return '00:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${hours}h ${minutes}m`;
  };
  
  // Get total time spent on task
  const totalTimeSpent = timeEntries.reduce((total, entry) => {
    if (entry.duration) {
      return total + entry.duration;
    } else if (entry.started && entry.ended) {
      const start = new Date(entry.started).getTime();
      const end = new Date(entry.ended).getTime();
      return total + ((end - start) / 1000);
    }
    return total;
  }, 0);
  
  return (
    <div className={className}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Time Tracking
            </div>
            {!activeEntry && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsAddDialogOpen(true)}
                className="h-8 px-2"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </CardTitle>
          <CardDescription>
            Track time spent on this task
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          {activeEntry ? (
            <div className="bg-muted/50 p-3 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Currently tracking</p>
                  <p className="text-2xl font-bold tracking-tighter mt-1">{elapsed}</p>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleStopTracking}
                  className="gap-1"
                >
                  <StopCircle className="h-4 w-4" />
                  Stop
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              variant="outline" 
              className="w-full gap-1"
              onClick={handleStartTracking}
            >
              <PlayCircle className="h-4 w-4" />
              Start Tracking
            </Button>
          )}
          
          {timeEntries.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Time Entries</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {timeEntries
                  .filter(entry => entry.ended) // Only show completed entries
                  .sort((a, b) => new Date(b.started).getTime() - new Date(a.started).getTime()) // Sort by date descending
                  .map(entry => (
                    <div 
                      key={entry.id} 
                      className="flex justify-between items-center p-2 bg-muted/30 rounded-md text-sm"
                    >
                      <div>
                        <div className="font-medium">{formatDuration(entry.duration)}</div>
                        <div className="text-muted-foreground text-xs">
                          {new Date(entry.started).toLocaleDateString()} • {entry.userName}
                        </div>
                        {entry.description && (
                          <div className="text-xs mt-1 line-clamp-1">
                            {entry.description}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          onClick={() => handleEditEntry(entry)}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-destructive" 
                          onClick={() => onDeleteEntry(entry.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-2">
          <div className="w-full flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Total time:</span>
            <span className="font-medium">{formatDuration(totalTimeSpent)}</span>
          </div>
        </CardFooter>
      </Card>
      
      {/* Dialog for manually adding time entry */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Time Entry</DialogTitle>
            <DialogDescription>
              Manually add time spent on this task.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Hours</label>
                <Input 
                  type="number" 
                  min="0" 
                  value={newEntry.hours} 
                  onChange={(e) => setNewEntry({...newEntry, hours: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Minutes</label>
                <Input 
                  type="number" 
                  min="0" 
                  max="59" 
                  value={newEntry.minutes} 
                  onChange={(e) => setNewEntry({...newEntry, minutes: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Description (optional)</label>
              <Textarea 
                value={newEntry.description}
                onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddManualEntry}>
              Add Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog for editing time entry */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Time Entry</DialogTitle>
            <DialogDescription>
              Modify the time entry details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Hours</label>
                <Input 
                  type="number" 
                  min="0" 
                  value={newEntry.hours} 
                  onChange={(e) => setNewEntry({...newEntry, hours: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Minutes</label>
                <Input 
                  type="number" 
                  min="0" 
                  max="59" 
                  value={newEntry.minutes} 
                  onChange={(e) => setNewEntry({...newEntry, minutes: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Description (optional)</label>
              <Textarea 
                value={newEntry.description}
                onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateEntry}>
              Update Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

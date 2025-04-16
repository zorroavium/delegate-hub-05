
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Clock, XCircle, Edit, Save, Plus } from 'lucide-react';
import { formatDistance, format, formatDistanceToNow } from 'date-fns';
import { Input } from '@/components/ui/input';
import { TaskTimeEntry } from '@/store/useTaskStore';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface TimeTrackerProps {
  taskId: string;
  timeEntries?: TaskTimeEntry[];
  onStartTracking: (entry: Omit<TaskTimeEntry, 'id'>) => void;
  onStopTracking: (entryId: string) => void;
  onDeleteEntry: (entryId: string) => void;
  onUpdateEntry: (entryId: string, updates: Partial<TaskTimeEntry>) => void;
  className?: string;
}

export const TimeTracker: React.FC<TimeTrackerProps> = ({
  taskId,
  timeEntries = [],
  onStartTracking,
  onStopTracking,
  onDeleteEntry,
  onUpdateEntry,
  className
}) => {
  const [isTracking, setIsTracking] = useState(false);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const [trackedTime, setTrackedTime] = useState<string>('00:00:00');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const timerRef = useRef<number | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TaskTimeEntry | null>(null);
  const [editedDescription, setEditedDescription] = useState<string>('');
  
  // Find any active time entry when component mounts
  useEffect(() => {
    const activeEntry = timeEntries.find(entry => !entry.ended);
    if (activeEntry) {
      setIsTracking(true);
      setActiveEntryId(activeEntry.id);
      setStartTime(new Date(activeEntry.started));
    }
  }, [timeEntries]);
  
  // Update timer display
  useEffect(() => {
    if (isTracking && startTime) {
      const updateTimer = () => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        const hours = Math.floor(elapsed / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((elapsed % 3600) / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');
        setTrackedTime(`${hours}:${minutes}:${seconds}`);
      };
      
      updateTimer();
      timerRef.current = window.setInterval(updateTimer, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTracking, startTime]);
  
  const handleStartTracking = () => {
    const now = new Date();
    const entry: Omit<TaskTimeEntry, 'id'> = {
      userId: '101', // Replace with actual user ID from auth
      userName: 'John Doe', // Replace with actual user name from auth
      started: now.toISOString(),
      description: ''
    };
    
    onStartTracking(entry);
    setIsTracking(true);
    setStartTime(now);
  };
  
  const handleStopTracking = () => {
    if (activeEntryId) {
      onStopTracking(activeEntryId);
      setIsTracking(false);
      setActiveEntryId(null);
      setStartTime(null);
      setTrackedTime('00:00:00');
    }
  };
  
  const handleEditEntry = (entry: TaskTimeEntry) => {
    setEditingEntry(entry);
    setEditedDescription(entry.description || '');
    setIsEditDialogOpen(true);
  };
  
  const saveEditedEntry = () => {
    if (editingEntry) {
      onUpdateEntry(editingEntry.id, {
        description: editedDescription
      });
      setIsEditDialogOpen(false);
      setEditingEntry(null);
    }
  };
  
  const formatDuration = (durationInSeconds: number) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const formatEntryTime = (isoString: string) => {
    return format(new Date(isoString), 'MMM d, HH:mm');
  };
  
  const calculateTotalDuration = () => {
    return timeEntries.reduce((total, entry) => {
      if (entry.duration) {
        return total + entry.duration;
      } else if (entry.started && entry.ended) {
        const start = new Date(entry.started).getTime();
        const end = new Date(entry.ended).getTime();
        return total + Math.floor((end - start) / 1000);
      }
      return total;
    }, 0);
  };
  
  const totalDuration = calculateTotalDuration();
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock size={16} />
            Time Tracking
          </CardTitle>
          <div className="flex gap-2">
            {isTracking ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 gap-1 text-red-500" 
                onClick={handleStopTracking}
              >
                <Pause size={14} />
                Stop
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 gap-1 text-green-500" 
                onClick={handleStartTracking}
              >
                <Play size={14} />
                Start
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isTracking && (
          <div className="bg-accent/30 rounded-md p-3 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-green-500 animate-pulse" />
              <span className="font-mono font-bold">{trackedTime}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-red-500"
              onClick={handleStopTracking}
            >
              <Pause size={14} />
            </Button>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground mb-2 flex justify-between">
          <span>Total time tracked: {formatDuration(totalDuration)}</span>
        </div>
        
        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
          {timeEntries.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-4">
              No time entries yet
            </div>
          ) : (
            timeEntries.map(entry => (
              <div 
                key={entry.id} 
                className={`flex items-center justify-between p-2 rounded-md border ${!entry.ended ? 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800' : 'bg-background'}`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>{formatEntryTime(entry.started)}</span>
                    {entry.ended && <span>→ {formatEntryTime(entry.ended)}</span>}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-medium truncate">
                      {entry.description || 'No description'}
                    </span>
                    <span className="text-xs font-mono ml-2">
                      {entry.duration ? formatDuration(entry.duration) : '...'}
                    </span>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-2">
                      <Edit size={12} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditEntry(entry)}>
                      <Edit size={14} className="mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-500 focus:text-red-500"
                      onClick={() => onDeleteEntry(entry.id)}
                    >
                      <XCircle size={14} className="mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          )}
        </div>
      </CardContent>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Time Entry</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Description</h4>
              <Textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="What were you working on?"
                className="h-24"
              />
            </div>
            
            {editingEntry && (
              <div>
                <h4 className="text-sm font-medium mb-2">Duration</h4>
                <div className="text-sm">
                  {editingEntry.duration ? formatDuration(editingEntry.duration) : 'In progress'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatEntryTime(editingEntry.started)}
                  {editingEntry.ended && ` → ${formatEntryTime(editingEntry.ended)}`}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEditedEntry}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

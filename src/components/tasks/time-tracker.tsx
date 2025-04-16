
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Play, 
  Pause, 
  Clock, 
  CalendarClock, 
  Trash2, 
  MoreVertical,
  Edit,
  Save
} from 'lucide-react';
import { format, formatDistance, formatDistanceToNow } from 'date-fns';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { TaskTimeEntry } from '@/store/useTaskStore';
import { useToast } from '@/hooks/use-toast';

interface TimeTrackerProps {
  taskId: string;
  timeEntries: TaskTimeEntry[];
  onStartTracking: (entry: Omit<TaskTimeEntry, 'id'>) => void;
  onStopTracking: (entryId: string) => void;
  onDeleteEntry: (entryId: string) => void;
  onUpdateEntry: (entryId: string, updates: Partial<TaskTimeEntry>) => void;
}

export const TimeTracker: React.FC<TimeTrackerProps> = ({
  taskId,
  timeEntries,
  onStartTracking,
  onStopTracking,
  onDeleteEntry,
  onUpdateEntry
}) => {
  const { toast } = useToast();
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState('');
  
  // Find if there's an active time entry when component loads
  useEffect(() => {
    const activeEntry = timeEntries.find(entry => !entry.ended);
    if (activeEntry) {
      setActiveEntryId(activeEntry.id);
    } else {
      setActiveEntryId(null);
    }
  }, [timeEntries]);
  
  // Update elapsed time for active entry
  useEffect(() => {
    if (!activeEntryId) {
      setElapsedTime(0);
      return;
    }
    
    const activeEntry = timeEntries.find(entry => entry.id === activeEntryId);
    if (!activeEntry) return;
    
    const intervalId = setInterval(() => {
      const startTime = new Date(activeEntry.started).getTime();
      const currentTime = new Date().getTime();
      const elapsed = Math.floor((currentTime - startTime) / 1000);
      setElapsedTime(elapsed);
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [activeEntryId, timeEntries]);
  
  const handleStartTracking = () => {
    const newEntry = {
      userId: '101', // This would come from the current user in a real app
      userName: 'John Doe', // This would come from the current user in a real app
      started: new Date().toISOString(),
      description: description || undefined
    };
    
    onStartTracking(newEntry);
    setDescription('');
    setIsDescriptionOpen(false);
    
    toast({
      title: "Time tracking started",
      description: "The timer has started for this task."
    });
  };
  
  const handleStopTracking = () => {
    if (activeEntryId) {
      onStopTracking(activeEntryId);
      
      toast({
        title: "Time tracking stopped",
        description: "Your time has been recorded for this task."
      });
    }
  };
  
  const handleEditEntry = (entry: TaskTimeEntry) => {
    setEditingEntryId(entry.id);
    setEditDescription(entry.description || '');
  };
  
  const handleSaveEdit = () => {
    if (!editingEntryId) return;
    
    onUpdateEntry(editingEntryId, {
      description: editDescription
    });
    
    setEditingEntryId(null);
    setEditDescription('');
    
    toast({
      title: "Time entry updated",
      description: "Your time entry has been updated."
    });
  };
  
  const getTotalTime = () => {
    if (!timeEntries.length) return '0h 0m';
    
    const totalSeconds = timeEntries.reduce((total, entry) => {
      if (entry.duration) {
        return total + entry.duration;
      } else if (entry.ended) {
        const start = new Date(entry.started).getTime();
        const end = new Date(entry.ended).getTime();
        return total + Math.floor((end - start) / 1000);
      } else {
        return total;
      }
    }, 0);
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    return `${hours}h ${minutes}m`;
  };
  
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };
  
  const formatEntryDuration = (entry: TaskTimeEntry): string => {
    if (entry.duration) {
      return formatDuration(entry.duration);
    } else if (entry.ended) {
      const start = new Date(entry.started).getTime();
      const end = new Date(entry.ended).getTime();
      const durationSeconds = Math.floor((end - start) / 1000);
      return formatDuration(durationSeconds);
    } else {
      return 'In progress';
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Time Tracking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeEntryId ? (
            <div className="flex flex-col gap-2">
              <div className="text-center">
                <div className="text-2xl font-mono">{formatDuration(elapsedTime)}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Started {formatDistanceToNow(new Date(timeEntries.find(e => e.id === activeEntryId)!.started), { addSuffix: true })}
                </div>
              </div>
              <Button 
                variant="destructive" 
                size="sm" 
                className="w-full flex items-center gap-2" 
                onClick={handleStopTracking}
              >
                <Pause className="h-4 w-4" />
                Stop Timer
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {isDescriptionOpen ? (
                <div className="space-y-2">
                  <Textarea 
                    placeholder="Add a description for this time entry (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="text-sm resize-none"
                    rows={2}
                  />
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setIsDescriptionOpen(false);
                        setDescription('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleStartTracking}>
                      Start Timer
                    </Button>
                  </div>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2" 
                  onClick={() => setIsDescriptionOpen(true)}
                >
                  <Play className="h-4 w-4" />
                  Start Timer
                </Button>
              )}
              
              {timeEntries.length > 0 && (
                <div className="text-center text-sm text-muted-foreground">
                  Total time: {getTotalTime()}
                </div>
              )}
            </div>
          )}
          
          {timeEntries.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Time Log</h4>
              <div className="space-y-2">
                {timeEntries.map(entry => (
                  <div 
                    key={entry.id}
                    className={`p-2 border rounded-md ${entry.id === activeEntryId ? 'border-primary bg-primary/5' : ''}`}
                  >
                    {editingEntryId === entry.id ? (
                      <div className="space-y-2">
                        <Textarea 
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="text-sm resize-none"
                          rows={2}
                        />
                        <div className="flex justify-end">
                          <Button 
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => {
                              setEditingEntryId(null);
                              setEditDescription('');
                            }}
                          >
                            Cancel
                          </Button>
                          <Button 
                            size="sm"
                            className="h-7 text-xs ml-2"
                            onClick={handleSaveEdit}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start">
                          <div className="text-sm font-medium">
                            {format(new Date(entry.started), 'MMM d, yyyy')}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditEntry(entry)}>
                                <Edit className="h-3.5 w-3.5 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => onDeleteEntry(entry.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <CalendarClock className="h-3 w-3" />
                            <span>
                              {format(new Date(entry.started), 'h:mm a')}
                              {entry.ended ? ` - ${format(new Date(entry.ended), 'h:mm a')}` : ''}
                            </span>
                          </div>
                          <div className={entry.id === activeEntryId ? 'text-primary font-medium' : ''}>
                            {formatEntryDuration(entry)}
                          </div>
                        </div>
                        {entry.description && (
                          <div className="mt-2 text-xs bg-muted/50 p-2 rounded-md">
                            {entry.description}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

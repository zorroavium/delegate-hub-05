
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bell, CheckCircle, Clock, Settings } from 'lucide-react';
import { useStatusStore, ReminderSettings } from '@/store/useStatusStore';
import { useTaskStore, Task } from '@/store/useTaskStore';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';

export function TaskReminders() {
  const { reminderSettings, setReminderSettings } = useStatusStore();
  const { tasks, checkDueDateReminders } = useTaskStore();
  const { toast } = useToast();
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [tempSettings, setTempSettings] = useState<ReminderSettings>({ ...reminderSettings });
  const [tasksWithReminders, setTasksWithReminders] = useState<Task[]>([]);
  
  const handleCheckReminders = () => {
    const tasksDueSoon = checkDueDateReminders();
    setTasksWithReminders(tasksDueSoon);
    
    if (tasksDueSoon.length === 0) {
      toast({
        title: "No upcoming deadlines",
        description: "There are no tasks that need attention in the coming days."
      });
    }
  };
  
  const saveReminderSettings = () => {
    setReminderSettings(tempSettings);
    setIsSettingsDialogOpen(false);
    
    toast({
      title: "Settings saved",
      description: "Your reminder settings have been updated."
    });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const getDueDateClass = (dueDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);
    
    if (taskDate.getTime() === today.getTime()) {
      return 'text-red-500 font-medium';
    } else if (taskDate.getTime() === tomorrow.getTime()) {
      return 'text-orange-500 font-medium';
    }
    return '';
  };
  
  return (
    <div>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Task Reminders
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsSettingsDialogOpen(true)}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Get notified about upcoming task deadlines
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="space-y-4">
            {/* Status */}
            <div className="flex items-center justify-between text-sm mb-4">
              <div>
                <span className="font-medium">Status: </span>
                <span>{reminderSettings.enabled ? 'Enabled' : 'Disabled'}</span>
              </div>
              <div>
                <span className="font-medium">Remind: </span>
                <span>{reminderSettings.daysBefore} day(s) before</span>
              </div>
            </div>
            
            {/* Reminder button */}
            <Button
              variant="outline"
              className="w-full"
              onClick={handleCheckReminders}
            >
              Check Upcoming Deadlines
            </Button>
            
            {/* Tasks with reminders */}
            {tasksWithReminders.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium">Tasks Due Soon</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {tasksWithReminders.map(task => (
                    <div 
                      key={task.id}
                      className="flex items-center justify-between p-2 bg-muted/30 rounded-md text-sm"
                    >
                      <div className="truncate">
                        {task.title}
                      </div>
                      <div className={`text-xs ${getDueDateClass(task.dueDate)}`}>
                        {formatDate(task.dueDate)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Settings Dialog */}
      <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reminder Settings</DialogTitle>
            <DialogDescription>
              Configure when and how you'd like to receive task reminders.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="reminder-enabled" className="font-medium">Enable Reminders</Label>
              <Switch 
                id="reminder-enabled" 
                checked={tempSettings.enabled}
                onCheckedChange={(checked) => setTempSettings({ ...tempSettings, enabled: checked })}
              />
            </div>
            
            {tempSettings.enabled && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="days-before">Days Before Deadline</Label>
                  <Input 
                    id="days-before" 
                    type="number" 
                    min="1" 
                    max="14"
                    value={tempSettings.daysBefore} 
                    onChange={(e) => setTempSettings({ 
                      ...tempSettings, 
                      daysBefore: Math.max(1, Math.min(14, parseInt(e.target.value) || 1)) 
                    })}
                    className="w-20"
                  />
                  <p className="text-xs text-muted-foreground">
                    Receive reminders this many days before the due date
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Notification Type</Label>
                  <RadioGroup 
                    value={tempSettings.notificationType}
                    onValueChange={(value) => setTempSettings({ 
                      ...tempSettings, 
                      notificationType: value as 'email' | 'push' | 'both' 
                    })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="notification-email" />
                      <Label htmlFor="notification-email">Email only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="push" id="notification-push" />
                      <Label htmlFor="notification-push">Push notifications only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="both" id="notification-both" />
                      <Label htmlFor="notification-both">Both email and push</Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveReminderSettings}>
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

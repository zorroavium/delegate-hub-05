
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RecurringConfig } from '@/store/useTaskStore';
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

interface RecurringTaskConfigProps {
  value: RecurringConfig;
  onChange: (config: RecurringConfig) => void;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function RecurringTaskConfig({ 
  value, 
  onChange, 
  isEnabled, 
  onToggle 
}: RecurringTaskConfigProps) {
  const handleFrequencyChange = (frequency: string) => {
    onChange({
      ...value,
      frequency: frequency as RecurringConfig['frequency']
    });
  };
  
  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const interval = parseInt(e.target.value);
    if (!isNaN(interval) && interval > 0) {
      onChange({
        ...value,
        interval
      });
    }
  };
  
  const handleEndAfterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const endAfter = parseInt(e.target.value);
    if (!isNaN(endAfter) && endAfter > 0) {
      onChange({
        ...value,
        endAfter,
        endDate: undefined // Clear end date when using end after
      });
    }
  };
  
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      endDate: e.target.value,
      endAfter: undefined // Clear end after when using end date
    });
  };
  
  const handleDayOfWeekToggle = (day: number) => {
    const currentDays = value.daysOfWeek || [];
    let newDays: number[];
    
    if (currentDays.includes(day)) {
      newDays = currentDays.filter(d => d !== day);
    } else {
      newDays = [...currentDays, day];
    }
    
    onChange({
      ...value,
      daysOfWeek: newDays
    });
  };
  
  const handleDayOfMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dayOfMonth = parseInt(e.target.value);
    if (!isNaN(dayOfMonth) && dayOfMonth > 0 && dayOfMonth <= 31) {
      onChange({
        ...value,
        dayOfMonth
      });
    }
  };
  
  const getDayLabel = (day: number) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[day];
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="recurring-toggle" className="font-medium">Recurring Task</Label>
        <Switch 
          id="recurring-toggle" 
          checked={isEnabled} 
          onCheckedChange={onToggle}
        />
      </div>
      
      {isEnabled && (
        <>
          <Separator className="my-4" />
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select 
                  value={value.frequency} 
                  onValueChange={handleFrequencyChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interval">Every</Label>
                <div className="flex items-center space-x-2">
                  <Input 
                    id="interval" 
                    type="number" 
                    min="1"
                    value={value.interval} 
                    onChange={handleIntervalChange}
                    className="w-20"
                  />
                  <span>
                    {value.frequency === 'daily' ? 'day(s)' : 
                     value.frequency === 'weekly' ? 'week(s)' : 
                     value.frequency === 'monthly' ? 'month(s)' : 'interval'}
                  </span>
                </div>
              </div>
            </div>
            
            {value.frequency === 'weekly' && (
              <div className="space-y-2">
                <Label>Days of Week</Label>
                <div className="flex flex-wrap gap-2">
                  {[0, 1, 2, 3, 4, 5, 6].map(day => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`day-${day}`} 
                        checked={(value.daysOfWeek || []).includes(day)}
                        onCheckedChange={() => handleDayOfWeekToggle(day)}
                      />
                      <Label htmlFor={`day-${day}`} className="text-sm">
                        {getDayLabel(day)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {value.frequency === 'monthly' && (
              <div className="space-y-2">
                <Label htmlFor="day-of-month">Day of Month</Label>
                <Input 
                  id="day-of-month" 
                  type="number" 
                  min="1" 
                  max="31"
                  value={value.dayOfMonth || 1} 
                  onChange={handleDayOfMonthChange}
                  className="w-20"
                />
              </div>
            )}
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <Label className="block font-medium">End</Label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="end-after" 
                      name="end-type"
                      checked={!!value.endAfter} 
                      onChange={() => onChange({...value, endAfter: 5, endDate: undefined})}
                    />
                    <Label htmlFor="end-after">After</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-6">
                    <Input 
                      type="number" 
                      min="1"
                      value={value.endAfter || ''} 
                      onChange={handleEndAfterChange}
                      disabled={!value.endAfter}
                      className="w-20"
                    />
                    <span>occurrence(s)</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="end-on-date" 
                      name="end-type"
                      checked={!!value.endDate} 
                      onChange={() => {
                        const date = new Date();
                        date.setMonth(date.getMonth() + 3);
                        onChange({
                          ...value, 
                          endDate: date.toISOString().split('T')[0], 
                          endAfter: undefined
                        });
                      }}
                    />
                    <Label htmlFor="end-on-date">On date</Label>
                  </div>
                  
                  <div className="ml-6">
                    <Input 
                      type="date" 
                      value={value.endDate || ''} 
                      onChange={handleEndDateChange}
                      disabled={!value.endDate}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

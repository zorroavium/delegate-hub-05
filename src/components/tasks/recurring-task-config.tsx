
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { RecurringConfig } from '@/store/useTaskStore';

interface RecurringTaskConfigProps {
  value: RecurringConfig;
  onChange: (config: RecurringConfig) => void;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const RecurringTaskConfig: React.FC<RecurringTaskConfigProps> = ({
  value,
  onChange,
  isEnabled,
  onToggle
}) => {
  const handleFrequencyChange = (frequency: "daily" | "weekly" | "monthly" | "custom") => {
    onChange({
      ...value,
      frequency
    });
  };

  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const interval = parseInt(e.target.value) || 1;
    onChange({
      ...value,
      interval: Math.max(1, interval)
    });
  };

  const handleEndAfterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const endAfter = parseInt(e.target.value) || 1;
    onChange({
      ...value,
      endAfter: Math.max(1, endAfter)
    });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      endDate: e.target.value
    });
  };

  return (
    <div className="space-y-4 p-4 border rounded-md bg-muted/20">
      <div className="flex items-center justify-between">
        <Label htmlFor="recurring-toggle" className="font-medium">Recurring Task</Label>
        <Switch
          id="recurring-toggle"
          checked={isEnabled}
          onCheckedChange={onToggle}
        />
      </div>

      {isEnabled && (
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select 
              value={value.frequency} 
              onValueChange={(val) => handleFrequencyChange(val as "daily" | "weekly" | "monthly" | "custom")}
            >
              <SelectTrigger id="frequency">
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
            <Label htmlFor="interval">
              {value.frequency === 'daily' && 'Repeat every X days'}
              {value.frequency === 'weekly' && 'Repeat every X weeks'}
              {value.frequency === 'monthly' && 'Repeat every X months'}
              {value.frequency === 'custom' && 'Custom interval (days)'}
            </Label>
            <Input
              id="interval"
              type="number"
              min="1"
              value={value.interval}
              onChange={handleIntervalChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-after">End after X occurrences</Label>
            <Input
              id="end-after"
              type="number"
              min="1"
              value={value.endAfter}
              onChange={handleEndAfterChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-date">Or end on specific date (optional)</Label>
            <Input
              id="end-date"
              type="date"
              value={value.endDate || ''}
              onChange={handleEndDateChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

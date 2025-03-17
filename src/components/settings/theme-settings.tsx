
import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/components/theme/theme-provider';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

export function ThemeSettings() {
  const { theme, setTheme, themeColor, setThemeColor, applySidebarTheme, toggleSidebarTheme } = useTheme();
  const [activeThemeColor, setActiveThemeColor] = useState(themeColor || 'blue');

  const handleSaveThemeColor = () => {
    setThemeColor(activeThemeColor);
    
    toast({
      title: "Theme color updated",
      description: `Theme color set to ${activeThemeColor.charAt(0).toUpperCase() + activeThemeColor.slice(1)}.`
    });
  };

  return (
    <>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Mode</h3>
        <RadioGroup
          value={theme}
          onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}
          className="grid grid-cols-3 gap-4"
        >
          <div>
            <RadioGroupItem
              value="light"
              id="theme-light"
              className="peer sr-only"
            />
            <Label
              htmlFor="theme-light"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Sun className="mb-3 h-6 w-6" />
              <span className="text-sm font-medium">Light</span>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem
              value="dark"
              id="theme-dark"
              className="peer sr-only"
            />
            <Label
              htmlFor="theme-dark"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Moon className="mb-3 h-6 w-6" />
              <span className="text-sm font-medium">Dark</span>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem
              value="system"
              id="theme-system"
              className="peer sr-only"
            />
            <Label
              htmlFor="theme-system"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Monitor className="mb-3 h-6 w-6" />
              <span className="text-sm font-medium">System</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Separator className="my-4" />
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Theme Colors</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center space-y-2">
            <div 
              className={`w-10 h-10 rounded-full bg-blue-500 cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 ${activeThemeColor === 'blue' ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
              onClick={() => setActiveThemeColor('blue')}
            ></div>
            <span className="text-sm">Blue</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div 
              className={`w-10 h-10 rounded-full bg-purple-500 cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-purple-500 ${activeThemeColor === 'purple' ? 'ring-2 ring-offset-2 ring-purple-500' : ''}`}
              onClick={() => setActiveThemeColor('purple')}
            ></div>
            <span className="text-sm">Purple</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div 
              className={`w-10 h-10 rounded-full bg-green-500 cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-green-500 ${activeThemeColor === 'green' ? 'ring-2 ring-offset-2 ring-green-500' : ''}`}
              onClick={() => setActiveThemeColor('green')}
            ></div>
            <span className="text-sm">Green</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div 
              className={`w-10 h-10 rounded-full bg-orange-500 cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-orange-500 ${activeThemeColor === 'orange' ? 'ring-2 ring-offset-2 ring-orange-500' : ''}`}
              onClick={() => setActiveThemeColor('orange')}
            ></div>
            <span className="text-sm">Orange</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mt-4">
          <Switch 
            id="apply-sidebar" 
            checked={applySidebarTheme}
            onCheckedChange={toggleSidebarTheme}
          />
          <Label htmlFor="apply-sidebar">Apply theme color to sidebar</Label>
        </div>
        
        <Button onClick={handleSaveThemeColor} className="mt-4">Save Theme Color</Button>
      </div>
    </>
  );
}

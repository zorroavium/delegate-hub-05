
import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  Calendar as CalendarIcon, 
  BarChart3, 
  Settings, 
  Bell, 
  Menu,
  X
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/theme/theme-toggle';

interface SidebarOption {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const sidebarOptions: SidebarOption[] = [
  {
    path: '/',
    label: 'Dashboard',
    icon: <LayoutDashboard size={20} />,
  },
  {
    path: '/tasks',
    label: 'Tasks',
    icon: <CheckSquare size={20} />,
  },
  {
    path: '/employees',
    label: 'Employees',
    icon: <Users size={20} />,
  },
  {
    path: '/calendar',
    label: 'Calendar',
    icon: <CalendarIcon size={20} />,
  },
  {
    path: '/reports',
    label: 'Reports',
    icon: <BarChart3 size={20} />,
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: <Settings size={20} />,
  },
  {
    path: '/notifications',
    label: 'Notifications',
    icon: <Bell size={20} />,
  },
];

const Sidebar = ({ className }: { className?: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <div className={cn('h-screen flex flex-col bg-card/80 border-r', className)}>
      <div className="p-4">
        <div className="flex items-center">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">P</div>
          <h1 className="text-xl font-bold ml-2">ProjectHub</h1>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto px-2 py-2">
        <nav className="grid gap-1">
          {sidebarOptions.map((option) => (
            <Button
              key={option.path}
              variant={location.pathname === option.path ? 'secondary' : 'ghost'}
              className={cn(
                'justify-start h-11',
                location.pathname === option.path ? 'bg-secondary font-medium text-secondary-foreground' : ''
              )}
              onClick={() => navigate(option.path)}
            >
              <span className="w-5 mr-3">{option.icon}</span>
              {option.label}
            </Button>
          ))}
        </nav>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
        <Separator className="my-3" />
        <div className="flex items-center">
          <Avatar className="h-9 w-9">
            <div className="bg-primary text-primary-foreground flex items-center justify-center w-full h-full text-lg font-medium">A</div>
          </Avatar>
          <div className="ml-2">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-muted-foreground">admin@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (!isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar for desktop */}
      {!isMobile && (
        <div className="w-64 hidden md:block">
          <Sidebar />
        </div>
      )}
      
      {/* Mobile sidebar (overlay) */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
          />
          <div className="relative z-10 w-64 h-full">
            <Sidebar />
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        {isMobile && (
          <div className="h-14 flex items-center px-4 border-b">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={() => setIsOpen(true)}
            >
              <Menu />
            </Button>
            <div className="flex items-center ml-3">
              <div className="w-6 h-6 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">P</div>
              <h1 className="text-lg font-bold ml-1">ProjectHub</h1>
            </div>
          </div>
        )}
        
        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 md:p-8 pb-16">
          {children}
        </main>
      </div>
    </div>
  );
}

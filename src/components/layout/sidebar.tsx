
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  CheckSquare, 
  BarChart3, 
  Users, 
  Bell, 
  Settings, 
  Calendar,
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar } from '@/components/ui/avatar';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon, label, to, isActive, isCollapsed, onClick }: SidebarItemProps) => (
  <Link
    to={to}
    className={cn(
      'flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 ease-in-out',
      isActive 
        ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
        : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground',
      isCollapsed ? 'justify-center' : ''
    )}
    onClick={onClick}
  >
    <div className={cn(
      'flex items-center justify-center w-6 h-6',
      isActive && 'animate-pulse-soft'
    )}>
      {icon}
    </div>
    {!isCollapsed && (
      <span className="transition-opacity duration-300">{label}</span>
    )}
  </Link>
);

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', to: '/' },
    { icon: <CheckSquare size={20} />, label: 'Tasks', to: '/tasks' },
    { icon: <Calendar size={20} />, label: 'Calendar', to: '/calendar' },
    { icon: <Users size={20} />, label: 'Employees', to: '/employees' },
    { icon: <BarChart3 size={20} />, label: 'Reports', to: '/reports' },
    { icon: <Bell size={20} />, label: 'Notifications', to: '/notifications' },
    { icon: <Settings size={20} />, label: 'Settings', to: '/settings' },
  ];

  // Mobile menu button
  const MobileMenuButton = () => (
    <button
      onClick={toggleMobileSidebar}
      className="fixed top-4 left-4 z-50 p-2 rounded-full bg-primary text-white shadow-md"
      aria-label="Toggle menu"
    >
      {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );

  // Collapse button
  const CollapseButton = () => (
    <button
      onClick={toggleSidebar}
      className={cn(
        'absolute -right-3 top-20 p-1.5 rounded-full bg-sidebar-primary text-sidebar-primary-foreground shadow-md transition-transform duration-300',
        isCollapsed && 'rotate-180'
      )}
      aria-label="Collapse sidebar"
    >
      <ChevronRight size={16} />
    </button>
  );

  return (
    <>
      {isMobile && <MobileMenuButton />}
      
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300',
          isMobile ? (isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none') : 'hidden'
        )}
        onClick={closeMobileSidebar}
      />

      <aside
        className={cn(
          'h-screen bg-sidebar flex flex-col border-r shadow-lg transition-all duration-300 ease-in-out relative z-40',
          isCollapsed ? 'w-[80px]' : 'w-[240px]',
          isMobile && (isMobileOpen ? 'translate-x-0' : '-translate-x-full'),
          'fixed left-0 top-0',
          className
        )}
      >
        {!isMobile && <CollapseButton />}
        
        {/* Logo & App Name */}
        <div className={cn(
          'py-6 flex items-center justify-center border-b transition-all duration-300',
          !isCollapsed && 'justify-start px-6'
        )}>
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
            <LayoutDashboard className="text-primary" />
          </div>
          {!isCollapsed && (
            <span className="ml-3 font-bold text-xl text-sidebar-foreground">Delegate</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => (
            <SidebarItem
              key={item.to}
              icon={item.icon}
              label={item.label}
              to={item.to}
              isActive={location.pathname === item.to}
              isCollapsed={isCollapsed}
              onClick={closeMobileSidebar}
            />
          ))}
        </nav>

        {/* User profile */}
        <div className={cn(
          'p-3 border-t flex items-center',
          isCollapsed ? 'justify-center' : 'px-4'
        )}>
          <Avatar className="h-9 w-9 border-2 border-sidebar-accent">
            <div className="bg-sidebar-accent text-sidebar-accent-foreground flex items-center justify-center w-full h-full text-sm font-medium">
              JD
            </div>
          </Avatar>
          
          {!isCollapsed && (
            <div className="ml-3 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">John Doe</p>
              <p className="text-xs text-sidebar-foreground/70 truncate">Manager</p>
            </div>
          )}

          {!isCollapsed && (
            <button className="ml-auto text-sidebar-foreground/80 hover:text-sidebar-foreground">
              <LogOut size={18} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main 
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          isMobile ? "ml-0" : "ml-[240px]"
        )}
      >
        <div className="container mx-auto p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

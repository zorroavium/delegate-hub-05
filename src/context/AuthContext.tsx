
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Define user roles
export type UserRole = 'admin' | 'employee' | 'client';

// Define user interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// Define permissions for each role
export interface PermissionMap {
  [key: string]: boolean;
}

const defaultPermissions: Record<UserRole, PermissionMap> = {
  admin: {
    viewDashboard: true,
    viewTasks: true,
    createTask: true,
    editTask: true,
    deleteTask: true,
    viewEmployees: true,
    editEmployees: true,
    viewReports: true,
    viewSettings: true,
    editSettings: true,
    manageUsers: true,
    accessAdminPanel: true,
  },
  employee: {
    viewDashboard: true,
    viewTasks: true,
    createTask: true,
    editTask: true,
    deleteTask: false,
    viewEmployees: true,
    editEmployees: false,
    viewReports: true,
    viewSettings: false,
    editSettings: false,
    manageUsers: false,
    accessAdminPanel: false,
  },
  client: {
    viewDashboard: true,
    viewTasks: true,
    createTask: false,
    editTask: false,
    deleteTask: false,
    viewEmployees: false,
    editEmployees: false,
    viewReports: false,
    viewSettings: false,
    editSettings: false,
    manageUsers: false,
    accessAdminPanel: false,
  },
};

// Define authentication context interface
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  hasPermission: (permission: string) => boolean;
  permissions: PermissionMap;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database (in a real app, this would be stored in a database)
const USERS = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123', // In a real app, this would be hashed
    name: 'Admin User',
    role: 'admin' as UserRole,
  },
  {
    id: '2',
    email: 'employee@example.com',
    password: 'employee123',
    name: 'Employee User',
    role: 'employee' as UserRole,
  },
  {
    id: '3',
    email: 'client@example.com',
    password: 'client123',
    name: 'Client User',
    role: 'client' as UserRole,
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState<PermissionMap>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  // Update permissions whenever user changes
  useEffect(() => {
    if (user) {
      setPermissions(defaultPermissions[user.role] || {});
    } else {
      setPermissions({});
    }
  }, [user]);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would make an API request
    const foundUser = USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      // Remove password before storing user
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      // Set permissions based on user role
      setPermissions(defaultPermissions[userWithoutPassword.role] || {});
      
      toast({
        title: 'Login successful',
        description: `Welcome back, ${userWithoutPassword.name}!`,
      });
      return true;
    }

    toast({
      title: 'Login failed',
      description: 'Invalid email or password',
      variant: 'destructive',
    });
    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setPermissions({});
    localStorage.removeItem('user');
    navigate('/login');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
    });
  };

  // Check if user has specified role(s)
  const hasRole = (roles: UserRole | UserRole[]) => {
    if (!user) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    
    return user.role === roles;
  };
  
  // Check if user has a specific permission
  const hasPermission = (permission: string) => {
    return permissions[permission] === true;
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
    hasRole,
    hasPermission,
    permissions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

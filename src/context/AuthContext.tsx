import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Define user roles
export type UserRole = 'admin' | 'employee' | 'client';

// Define user interface with enhanced security fields
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  lastLogin?: string;
  passwordLastChanged?: string;
  requiresPasswordChange?: boolean;
  mfaEnabled?: boolean;
  failedLoginAttempts?: number;
  isLocked?: boolean;
  lockUntil?: string;
  securityQuestions?: { question: string; answer: string }[];
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
    auditLog: true,
    configureSecurity: true,
    exportData: true,
    importData: true,
    manageIntegrations: true,
    viewAuditTrail: true,
    manageBackups: true,
    configureSystem: true,
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
    auditLog: false,
    configureSecurity: false,
    exportData: true,
    importData: false,
    manageIntegrations: false,
    viewAuditTrail: false,
    manageBackups: false,
    configureSystem: false,
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
    auditLog: false,
    configureSecurity: false,
    exportData: false,
    importData: false,
    manageIntegrations: false,
    viewAuditTrail: false,
    manageBackups: false,
    configureSystem: false,
  },
};

// Enhanced security settings
const securitySettings = {
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true,
    expirationDays: 90,
    preventReuseCount: 5,
  },
  lockoutPolicy: {
    maxAttempts: 5,
    lockoutDurationMinutes: 15,
  },
  mfaPolicy: {
    adminRequired: true,
    employeeOptional: true,
    clientOptional: false,
  },
  sessionPolicy: {
    sessionTimeoutMinutes: 30,
    rememberMeDays: 30,
  }
};

// Define authentication context interface with enhanced security features
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  hasPermission: (permission: string) => boolean;
  permissions: PermissionMap;
  passwordResetToken: string | null;
  generatePasswordResetToken: (email: string) => Promise<string | null>;
  validatePasswordResetToken: (token: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  setupMfa: () => Promise<{ secret: string; qrCode: string } | null>;
  verifyMfa: (code: string) => Promise<boolean>;
  disableMfa: (password: string) => Promise<boolean>;
  getSecurityAuditLog: () => Promise<any[]>;
  lockAccount: (userId: string) => Promise<boolean>;
  unlockAccount: (userId: string) => Promise<boolean>;
  getSessionTimeout: () => number;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database with enhanced security fields
const USERS: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin' as UserRole,
    lastLogin: new Date().toISOString(),
    passwordLastChanged: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    requiresPasswordChange: false,
    mfaEnabled: true,
    failedLoginAttempts: 0,
    isLocked: false,
  },
  {
    id: '2',
    email: 'employee@example.com',
    name: 'Employee User',
    role: 'employee' as UserRole,
    lastLogin: new Date().toISOString(),
    passwordLastChanged: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
    requiresPasswordChange: false,
    mfaEnabled: false,
    failedLoginAttempts: 0,
    isLocked: false,
  },
  {
    id: '3',
    email: 'client@example.com',
    name: 'Client User',
    role: 'client' as UserRole,
    lastLogin: new Date().toISOString(),
    passwordLastChanged: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    requiresPasswordChange: false,
    mfaEnabled: false,
    failedLoginAttempts: 0,
    isLocked: false,
  },
];

// Mock password database (in a real app, this would be hashed in the user record)
const PASSWORDS: Record<string, string> = {
  'admin@example.com': 'admin123',
  'employee@example.com': 'employee123',
  'client@example.com': 'client123',
};

// Mock audit log
const AUDIT_LOG: any[] = [];

// Mock password reset tokens
const PASSWORD_RESET_TOKENS: Record<string, { token: string; expires: Date; email: string }> = {};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState<PermissionMap>({});
  const [passwordResetToken, setPasswordResetToken] = useState<string | null>(null);
  const [sessionTimeout, setSessionTimeout] = useState<number>(securitySettings.sessionPolicy.sessionTimeoutMinutes * 60 * 1000);
  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Add a security audit entry
  const addAuditLog = useCallback((action: string, details: any, userId?: string) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action,
      details,
      userId: userId || user?.id || 'anonymous',
      ip: '127.0.0.1', // In a real app, this would be the actual IP
      userAgent: navigator.userAgent,
    };
    
    AUDIT_LOG.unshift(logEntry);
    
    // Keep audit log to a reasonable size in this demo
    if (AUDIT_LOG.length > 1000) {
      AUDIT_LOG.pop();
    }
    
    return logEntry;
  }, [user]);

  // Reset session timeout
  const resetSessionTimeout = useCallback(() => {
    if (sessionTimer) {
      clearTimeout(sessionTimer);
    }
    
    if (user) {
      const timer = setTimeout(() => {
        toast({
          title: 'Session expired',
          description: 'Your session has expired due to inactivity. Please log in again.',
          variant: 'destructive',
        });
        logout();
      }, sessionTimeout);
      
      setSessionTimer(timer);
    }
  }, [sessionTimeout, user, toast]);

  // Update permissions whenever user changes
  useEffect(() => {
    if (user) {
      setPermissions(defaultPermissions[user.role] || {});
    } else {
      setPermissions({});
    }
  }, [user]);

  // Activity listener to reset session timeout
  useEffect(() => {
    if (user) {
      const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
      
      const handleUserActivity = () => {
        resetSessionTimeout();
      };
      
      activityEvents.forEach(event => {
        window.addEventListener(event, handleUserActivity);
      });
      
      // Initial timeout
      resetSessionTimeout();
      
      return () => {
        if (sessionTimer) {
          clearTimeout(sessionTimer);
        }
        
        activityEvents.forEach(event => {
          window.removeEventListener(event, handleUserActivity);
        });
      };
    }
  }, [user, resetSessionTimeout, sessionTimer]);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // Check if the stored user session is expired (for remember me)
        const expiryStr = localStorage.getItem('session_expiry');
        if (expiryStr) {
          const expiry = new Date(expiryStr);
          if (expiry > new Date()) {
            setUser(parsedUser);
            addAuditLog('session_restored', { method: 'local_storage' }, parsedUser.id);
          } else {
            // Session expired
            localStorage.removeItem('user');
            localStorage.removeItem('session_expiry');
            addAuditLog('session_expired', { method: 'local_storage' });
          }
        } else {
          setUser(parsedUser);
          addAuditLog('session_restored', { method: 'local_storage' }, parsedUser.id);
        }
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('session_expiry');
        addAuditLog('session_parse_error', { error: String(error) });
      }
    }
    setIsLoading(false);
  }, [addAuditLog]);

  // Login function with enhanced security
  const login = async (email: string, password: string, rememberMe = false): Promise<boolean> => {
    // In a real app, this would make an API request
    const foundUserIndex = USERS.findIndex(
      u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (foundUserIndex === -1) {
      addAuditLog('login_failed', { email, reason: 'user_not_found' });
      return false;
    }

    const foundUser = USERS[foundUserIndex];
    
    // Check if account is locked
    if (foundUser.isLocked) {
      const lockUntil = foundUser.lockUntil ? new Date(foundUser.lockUntil) : null;
      if (lockUntil && lockUntil > new Date()) {
        // Still locked
        addAuditLog('login_failed', { email, reason: 'account_locked', userId: foundUser.id });
        return false;
      } else {
        // Lock expired, reset lock and attempts
        USERS[foundUserIndex] = {
          ...foundUser,
          isLocked: false,
          lockUntil: undefined,
          failedLoginAttempts: 0,
        };
      }
    }
    
    // Check password
    if (PASSWORDS[email.toLowerCase()] !== password) {
      // Increment failed attempts and potentially lock account
      const failedAttempts = (foundUser.failedLoginAttempts || 0) + 1;
      
      USERS[foundUserIndex] = {
        ...foundUser,
        failedLoginAttempts: failedAttempts,
      };
      
      if (failedAttempts >= securitySettings.lockoutPolicy.maxAttempts) {
        const lockUntil = new Date();
        lockUntil.setMinutes(lockUntil.getMinutes() + securitySettings.lockoutPolicy.lockoutDurationMinutes);
        
        USERS[foundUserIndex] = {
          ...USERS[foundUserIndex],
          isLocked: true,
          lockUntil: lockUntil.toISOString(),
        };
        
        addAuditLog('account_locked', { 
          email, 
          reason: 'max_failed_attempts', 
          attemptsCount: failedAttempts,
          lockDuration: securitySettings.lockoutPolicy.lockoutDurationMinutes,
          userId: foundUser.id
        });
      }
      
      addAuditLog('login_failed', { 
        email, 
        reason: 'invalid_password', 
        attemptNumber: failedAttempts,
        userId: foundUser.id
      });
      
      return false;
    }

    // For admin users, MFA should be verified separately (already done in the login flow)
    // We'll assume it's verified at this point and proceed with login

    // Login successful - update user data
    const { password: _, ...userWithoutPassword } = {
      ...foundUser,
      lastLogin: new Date().toISOString(),
      failedLoginAttempts: 0, // Reset failed attempts on successful login
      isLocked: false,
      lockUntil: undefined,
    };
    
    // Update the user in our "database"
    USERS[foundUserIndex] = userWithoutPassword;
    
    setUser(userWithoutPassword);
    
    // Store user in local storage with expiry for "remember me"
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    
    if (rememberMe) {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + securitySettings.sessionPolicy.rememberMeDays);
      localStorage.setItem('session_expiry', expiry.toISOString());
    }
    
    // Set permissions based on user role
    setPermissions(defaultPermissions[userWithoutPassword.role] || {});
    
    addAuditLog('login_success', { email, rememberMe }, userWithoutPassword.id);
    
    toast({
      title: 'Login successful',
      description: `Welcome back, ${userWithoutPassword.name}!`,
    });
    
    return true;
  };

  // Logout function
  const logout = () => {
    if (user) {
      addAuditLog('logout', { method: 'user_initiated' }, user.id);
    }
    
    setUser(null);
    setPermissions({});
    localStorage.removeItem('user');
    localStorage.removeItem('session_expiry');
    
    if (sessionTimer) {
      clearTimeout(sessionTimer);
      setSessionTimer(null);
    }
    
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

  // Generate a password reset token
  const generatePasswordResetToken = async (email: string): Promise<string | null> => {
    const foundUser = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!foundUser) {
      // We don't want to reveal that the email doesn't exist
      // But for demo purposes, we'll return null
      addAuditLog('password_reset_requested', { email, status: 'user_not_found' });
      return null;
    }
    
    // Generate a token (in a real app, this would be a secure random token)
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Set expiry to 24 hours from now
    const expires = new Date();
    expires.setHours(expires.getHours() + 24);
    
    // Store the token
    PASSWORD_RESET_TOKENS[token] = { token, expires, email };
    
    addAuditLog('password_reset_token_generated', { email }, foundUser.id);
    
    return token;
  };

  // Validate a password reset token
  const validatePasswordResetToken = async (token: string): Promise<boolean> => {
    const tokenData = PASSWORD_RESET_TOKENS[token];
    
    if (!tokenData) {
      addAuditLog('password_reset_validation_failed', { token, reason: 'token_not_found' });
      return false;
    }
    
    if (new Date() > tokenData.expires) {
      // Token expired
      delete PASSWORD_RESET_TOKENS[token];
      addAuditLog('password_reset_validation_failed', { token, reason: 'token_expired' });
      return false;
    }
    
    addAuditLog('password_reset_token_validated', { token });
    
    return true;
  };

  // Change password (when logged in)
  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) {
      addAuditLog('password_change_failed', { reason: 'not_authenticated' });
      return false;
    }
    
    const storedPassword = PASSWORDS[user.email.toLowerCase()];
    
    if (storedPassword !== currentPassword) {
      addAuditLog('password_change_failed', { reason: 'invalid_current_password' }, user.id);
      return false;
    }
    
    // Validate new password against policy
    if (!validatePassword(newPassword)) {
      addAuditLog('password_change_failed', { reason: 'password_policy_violation' }, user.id);
      return false;
    }
    
    // Update password
    PASSWORDS[user.email.toLowerCase()] = newPassword;
    
    // Update user's password change timestamp
    const userIndex = USERS.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      USERS[userIndex] = {
        ...USERS[userIndex],
        passwordLastChanged: new Date().toISOString(),
        requiresPasswordChange: false,
      };
      
      // Update current user state
      setUser({
        ...user,
        passwordLastChanged: new Date().toISOString(),
        requiresPasswordChange: false,
      });
    }
    
    addAuditLog('password_changed', { method: 'user_initiated' }, user.id);
    
    return true;
  };

  // Reset password (when not logged in, using token)
  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    const tokenData = PASSWORD_RESET_TOKENS[token];
    
    if (!tokenData || new Date() > tokenData.expires) {
      addAuditLog('password_reset_failed', { token, reason: tokenData ? 'token_expired' : 'token_not_found' });
      return false;
    }
    
    // Validate new password against policy
    if (!validatePassword(newPassword)) {
      addAuditLog('password_reset_failed', { token, reason: 'password_policy_violation' });
      return false;
    }
    
    const email = tokenData.email;
    
    // Update password
    PASSWORDS[email.toLowerCase()] = newPassword;
    
    // Update user's password change timestamp
    const userIndex = USERS.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex !== -1) {
      USERS[userIndex] = {
        ...USERS[userIndex],
        passwordLastChanged: new Date().toISOString(),
        requiresPasswordChange: false,
      };
      
      addAuditLog('password_reset_successful', { token }, USERS[userIndex].id);
    }
    
    // Remove used token
    delete PASSWORD_RESET_TOKENS[token];
    
    return true;
  };

  // Setup MFA for the current user
  const setupMfa = async (): Promise<{ secret: string; qrCode: string } | null> => {
    if (!user) {
      addAuditLog('mfa_setup_failed', { reason: 'not_authenticated' });
      return null;
    }
    
    // In a real app, this would generate a TOTP secret and QR code
    const secret = 'JBSWY3DPEHPK3PXP'; // Example secret
    const qrCode = `otpauth://totp/DelegateEase:${user.email}?secret=${secret}&issuer=DelegateEase`;
    
    addAuditLog('mfa_setup_initiated', {}, user.id);
    
    return { secret, qrCode };
  };

  // Verify MFA code and enable MFA
  const verifyMfa = async (code: string): Promise<boolean> => {
    if (!user) {
      addAuditLog('mfa_verification_failed', { reason: 'not_authenticated' });
      return false;
    }
    
    // In a real app, this would validate the TOTP code
    // For demo, we'll accept '123456'
    if (code !== '123456') {
      addAuditLog('mfa_verification_failed', { reason: 'invalid_code' }, user.id);
      return false;
    }
    
    // Update user's MFA status
    const userIndex = USERS.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      USERS[userIndex] = {
        ...USERS[userIndex],
        mfaEnabled: true,
      };
      
      // Update current user state
      setUser({
        ...user,
        mfaEnabled: true,
      });
      
      addAuditLog('mfa_enabled', {}, user.id);
    }
    
    return true;
  };

  // Disable MFA (requires password confirmation)
  const disableMfa = async (password: string): Promise<boolean> => {
    if (!user) {
      addAuditLog('mfa_disable_failed', { reason: 'not_authenticated' });
      return false;
    }
    
    const storedPassword = PASSWORDS[user.email.toLowerCase()];
    
    if (storedPassword !== password) {
      addAuditLog('mfa_disable_failed', { reason: 'invalid_password' }, user.id);
      return false;
    }
    
    // Update user's MFA status
    const userIndex = USERS.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      USERS[userIndex] = {
        ...USERS[userIndex],
        mfaEnabled: false,
      };
      
      // Update current user state
      setUser({
        ...user,
        mfaEnabled: false,
      });
      
      addAuditLog('mfa_disabled', {}, user.id);
    }
    
    return true;
  };

  // Get security audit log
  const getSecurityAuditLog = async (): Promise<any[]> => {
    if (!user || user.role !== 'admin') {
      addAuditLog('audit_log_access_denied', { reason: user ? 'insufficient_permissions' : 'not_authenticated' }, user?.id);
      return [];
    }
    
    addAuditLog('audit_log_accessed', {}, user.id);
    
    return AUDIT_LOG;
  };

  // Lock an account (admin only)
  const lockAccount = async (userId: string): Promise<boolean> => {
    if (!user || user.role !== 'admin') {
      addAuditLog('account_lock_failed', { 
        userId, 
        reason: user ? 'insufficient_permissions' : 'not_authenticated' 
      }, user?.id);
      return false;
    }
    
    const userIndex = USERS.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      addAuditLog('account_lock_failed', { userId, reason: 'user_not_found' }, user.id);
      return false;
    }
    
    const lockUntil = new Date();
    lockUntil.setMinutes(lockUntil.getMinutes() + securitySettings.lockoutPolicy.lockoutDurationMinutes);
    
    USERS[userIndex] = {
      ...USERS[userIndex],
      isLocked: true,
      lockUntil: lockUntil.toISOString(),
    };
    
    addAuditLog('account_locked', { 
      targetUserId: userId, 
      reason: 'admin_action', 
      lockDuration: securitySettings.lockoutPolicy.lockoutDurationMinutes,
    }, user.id);
    
    return true;
  };

  // Unlock an account (admin only)
  const unlockAccount = async (userId: string): Promise<boolean> => {
    if (!user || user.role !== 'admin') {
      addAuditLog('account_unlock_failed', { 
        userId, 
        reason: user ? 'insufficient_permissions' : 'not_authenticated' 
      }, user?.id);
      return false;
    }
    
    const userIndex = USERS.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      addAuditLog('account_unlock_failed', { userId, reason: 'user_not_found' }, user.id);
      return false;
    }
    
    USERS[userIndex] = {
      ...USERS[userIndex],
      isLocked: false,
      lockUntil: undefined,
      failedLoginAttempts: 0,
    };
    
    addAuditLog('account_unlocked', { 
      targetUserId: userId, 
      reason: 'admin_action',
    }, user.id);
    
    return true;
  };

  // Get current session timeout
  const getSessionTimeout = () => {
    return sessionTimeout / (60 * 1000); // Return in minutes
  };

  // Helper function to validate password against policy
  const validatePassword = (password: string): boolean => {
    const { minLength, requireUppercase, requireLowercase, requireNumber, requireSpecialChar } = securitySettings.passwordPolicy;
    
    if (password.length < minLength) return false;
    if (requireUppercase && !/[A-Z]/.test(password)) return false;
    if (requireLowercase && !/[a-z]/.test(password)) return false;
    if (requireNumber && !/[0-9]/.test(password)) return false;
    if (requireSpecialChar && !/[^A-Za-z0-9]/.test(password)) return false;
    
    return true;
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
    passwordResetToken,
    generatePasswordResetToken,
    validatePasswordResetToken,
    changePassword,
    resetPassword,
    setupMfa,
    verifyMfa,
    disableMfa,
    getSecurityAuditLog,
    lockAccount,
    unlockAccount,
    getSessionTimeout,
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

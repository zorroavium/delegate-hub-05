
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/context/AuthContext';
import { Shield, Clock, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireMFA?: boolean;
  minSecurityLevel?: number;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requireMFA = false,
  minSecurityLevel = 0,
}) => {
  const { isAuthenticated, isLoading, user, hasRole, securityLevel = 1, mfaEnabled = false } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [showWarning, setShowWarning] = useState(false);
  const [shouldShowSecurityToast, setShouldShowSecurityToast] = useState(false);
  const [shouldShowMFAToast, setShouldShowMFAToast] = useState(false);
  const [shouldShowPermissionToast, setShouldShowPermissionToast] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState<{to: string, replace: boolean, state?: any} | null>(null);

  // Log access attempts for security audit
  useEffect(() => {
    if (user) {
      console.log(`Access attempt: ${user.id} to ${location.pathname} at ${new Date().toISOString()}`);
      
      // If security level is below recommended but they can still access
      if (securityLevel < minSecurityLevel) {
        setShowWarning(true);
        setShouldShowSecurityToast(true);
      }
    }
  }, [user, location.pathname, securityLevel, minSecurityLevel]);

  // Handle toast notifications in separate effects to avoid re-renders during render
  useEffect(() => {
    if (shouldShowSecurityToast) {
      toast({
        title: "Security Recommendation",
        description: "For enhanced security, additional verification is recommended for this section.",
        variant: "default",
      });
      setShouldShowSecurityToast(false);
    }
  }, [shouldShowSecurityToast, toast]);

  useEffect(() => {
    if (shouldShowMFAToast) {
      toast({
        title: "MFA Required",
        description: "This section requires multi-factor authentication. Please set up MFA in your security settings.",
        variant: "destructive",
      });
      setShouldShowMFAToast(false);
    }
  }, [shouldShowMFAToast, toast]);

  useEffect(() => {
    if (shouldShowPermissionToast) {
      toast({
        title: "Permission Denied",
        description: "You don't have the required permissions to access this area.",
        variant: "destructive",
      });
      setShouldShowPermissionToast(false);
    }
  }, [shouldShowPermissionToast, toast]);

  // Check various conditions and set redirect info in a single useEffect
  useEffect(() => {
    // Only run checks when auth is confirmed (not loading)
    if (!isLoading) {
      // Check authentication
      if (!isAuthenticated) {
        setShouldRedirect({
          to: "/login",
          replace: true,
          state: { from: location, message: "Authentication required" }
        });
        return;
      }

      // Check MFA requirement - only show toast and redirect if MFA is not set up
      if (requireMFA && !mfaEnabled && user) {
        setShouldShowMFAToast(true);
        setShouldRedirect({
          to: "/settings?tab=security&setup=mfa",
          replace: true,
          state: { from: location }
        });
        return;
      }

      // Check security level - only redirect if security level is too low
      if (securityLevel < minSecurityLevel && minSecurityLevel > 1) {
        setShouldShowSecurityToast(true);
        setShouldRedirect({
          to: "/",
          replace: true
        });
        return;
      }

      // Check role permissions
      if (allowedRoles && user) {
        const hasRequiredRole = allowedRoles.some(role => hasRole(role));
        
        if (!hasRequiredRole) {
          setShouldShowPermissionToast(true);
          
          // Log unauthorized access attempt to security audit
          console.log(`Unauthorized access attempt: ${user.id} to ${location.pathname} at ${new Date().toISOString()}`);
          
          setShouldRedirect({
            to: "/",
            replace: true
          });
          return;
        }
      }
      
      // Clear any previous redirect if all checks pass
      setShouldRedirect(null);
    }
  }, [isLoading, isAuthenticated, requireMFA, mfaEnabled, user, securityLevel, minSecurityLevel, allowedRoles, hasRole, location]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Verifying credentials...</p>
      </div>
    );
  }

  // Handle redirects
  if (shouldRedirect) {
    return <Navigate to={shouldRedirect.to} state={shouldRedirect.state} replace={shouldRedirect.replace} />;
  }

  // User passes all checks
  return (
    <>
      {showWarning && (
        <div className="mb-4 rounded-md bg-amber-50 p-4 dark:bg-amber-900/20">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">Security Notice</h3>
              <div className="mt-2 text-sm text-amber-700 dark:text-amber-200">
                <p>
                  For enhanced security, additional verification is recommended for this section. 
                  Visit your security settings to increase your security level.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {children}
    </>
  );
};

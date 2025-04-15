
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireMFA?: boolean;
  minSecurityLevel?: number;
  suppressSecurityNotice?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requireMFA = false,
  minSecurityLevel = 0,
  suppressSecurityNotice = false,
}) => {
  const { isAuthenticated, isLoading, user, hasRole, mfaEnabled = false } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [shouldShowMFAToast, setShouldShowMFAToast] = useState(false);
  const [shouldShowPermissionToast, setShouldShowPermissionToast] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState<{to: string, replace: boolean, state?: any} | null>(null);

  // Handle MFA toast display
  useEffect(() => {
    if (shouldShowMFAToast && !suppressSecurityNotice) {
      toast({
        title: "MFA Required",
        description: "This section requires multi-factor authentication. Please set up MFA in your security settings.",
        variant: "destructive",
      });
      setShouldShowMFAToast(false);
    }
  }, [shouldShowMFAToast, toast, suppressSecurityNotice]);

  // Handle permissions toast display
  useEffect(() => {
    if (shouldShowPermissionToast && !suppressSecurityNotice) {
      toast({
        title: "Permission Denied",
        description: "You don't have the required permissions to access this area.",
        variant: "destructive",
      });
      setShouldShowPermissionToast(false);
    }
  }, [shouldShowPermissionToast, toast, suppressSecurityNotice]);

  // Main authentication and permission logic
  useEffect(() => {
    if (!isLoading) {
      // Handle authentication
      if (!isAuthenticated) {
        setShouldRedirect({
          to: "/login",
          replace: true,
          state: { from: location, message: "Authentication required" }
        });
        return;
      }

      // Handle MFA requirement
      if (requireMFA && !mfaEnabled && user) {
        if (!suppressSecurityNotice) {
          setShouldShowMFAToast(true);
        }
        setShouldRedirect({
          to: "/settings?tab=security&setup=mfa",
          replace: true,
          state: { from: location }
        });
        return;
      }

      // Handle role-based permissions
      if (allowedRoles && user) {
        const hasRequiredRole = allowedRoles.some(role => hasRole(role));
        
        if (!hasRequiredRole) {
          if (!suppressSecurityNotice) {
            setShouldShowPermissionToast(true);
            console.log(`Unauthorized access attempt: ${user.id} to ${location.pathname} at ${new Date().toISOString()}`);
          }
          
          setShouldRedirect({
            to: "/",
            replace: true
          });
          return;
        }
      }
      
      setShouldRedirect(null);
    }
  }, [isLoading, isAuthenticated, requireMFA, mfaEnabled, user, allowedRoles, hasRole, location, suppressSecurityNotice]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Verifying credentials...</p>
      </div>
    );
  }

  // Redirect if needed
  if (shouldRedirect) {
    return <Navigate to={shouldRedirect.to} state={shouldRedirect.state} replace={shouldRedirect.replace} />;
  }

  // Show the protected content
  return <>{children}</>;
};

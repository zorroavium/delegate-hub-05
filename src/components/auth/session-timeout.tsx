
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Clock, RefreshCw } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';

// Session timeout warning (in seconds) before actual session timeout
const WARNING_BEFORE_TIMEOUT = 60;

export function SessionTimeout() {
  const { getSessionTimeout, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(WARNING_BEFORE_TIMEOUT);
  const [progress, setProgress] = useState(100);

  // Check session timeout and show warning before session expires
  useEffect(() => {
    // Calculate when to show the warning
    const sessionTimeoutMinutes = getSessionTimeout();
    const sessionTimeoutMs = sessionTimeoutMinutes * 60 * 1000;
    const warningTimeMs = sessionTimeoutMs - (WARNING_BEFORE_TIMEOUT * 1000);
    
    // Set up the warning timer
    const warningTimer = setTimeout(() => {
      setIsOpen(true);
      setTimeLeft(WARNING_BEFORE_TIMEOUT);
      setProgress(100);
    }, warningTimeMs);
    
    // Set up the logout timer
    const logoutTimer = setTimeout(() => {
      if (isOpen) {
        logout();
      }
    }, sessionTimeoutMs);
    
    return () => {
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);
    };
  }, [getSessionTimeout, logout]);

  // Countdown timer when dialog is open
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isOpen && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newValue = prev - 1;
          setProgress((newValue / WARNING_BEFORE_TIMEOUT) * 100);
          return newValue;
        });
      }, 1000);
    } else if (timeLeft <= 0 && isOpen) {
      logout();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, timeLeft, logout]);

  // Handle extend session
  const handleExtendSession = () => {
    // In a real app, this would make an API call to extend the session
    setIsOpen(false);
    // Reset the timeout timers by causing the first effect to re-run
    // This is just for demo purposes, in a real app you would refresh the token
  };

  // Format time remaining
  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            Session Timeout Warning
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your session will expire in {formatTimeRemaining()}. Would you like to extend your session?
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-2">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Time remaining</span>
              <span>{formatTimeRemaining()}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Log Out Now</AlertDialogCancel>
          <AlertDialogAction onClick={handleExtendSession} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Extend Session
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

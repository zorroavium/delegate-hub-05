
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, KeyRound, ShieldAlert } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

// Password strength calculation
const calculatePasswordStrength = (password: string): number => {
  let strength = 0;
  
  if (password.length >= 8) strength += 20;
  if (password.length >= 12) strength += 10;
  if (/[A-Z]/.test(password)) strength += 20;
  if (/[a-z]/.test(password)) strength += 20;
  if (/[0-9]/.test(password)) strength += 20;
  if (/[^A-Za-z0-9]/.test(password)) strength += 20;
  
  return Math.min(100, strength);
};

// Get color based on password strength
const getStrengthColor = (strength: number): string => {
  if (strength < 40) return 'bg-destructive';
  if (strength < 70) return 'bg-amber-500';
  return 'bg-green-500';
};

// Get message based on password strength
const getStrengthMessage = (strength: number): string => {
  if (strength < 40) return 'Weak';
  if (strength < 70) return 'Moderate';
  return 'Strong';
};

// Password change schema with validation
const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required' }),
  newPassword: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .refine(val => /[A-Z]/.test(val), { message: 'Password must contain an uppercase letter' })
    .refine(val => /[a-z]/.test(val), { message: 'Password must contain a lowercase letter' })
    .refine(val => /[0-9]/.test(val), { message: 'Password must contain a number' })
    .refine(val => /[^A-Za-z0-9]/.test(val), { message: 'Password must contain a special character' }),
  confirmPassword: z.string().min(1, { message: 'Confirm password is required' }),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;

interface PasswordChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PasswordChangeDialog({ open, onOpenChange }: PasswordChangeDialogProps) {
  const { toast } = useToast();
  const { changePassword } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const form = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const watchPassword = form.watch('newPassword');

  // Update password strength when password changes
  React.useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(watchPassword));
  }, [watchPassword]);

  const resetForm = () => {
    form.reset();
    setPasswordStrength(0);
  };

  const onClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const onSubmit = async (data: PasswordChangeFormValues) => {
    setIsSubmitting(true);
    
    try {
      const success = await changePassword(data.currentPassword, data.newPassword);
      
      if (success) {
        toast({
          title: 'Password changed',
          description: 'Your password has been updated successfully.',
        });
        onClose();
      } else {
        toast({
          title: 'Password change failed',
          description: 'Your current password is incorrect or the new password does not meet requirements.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Password change failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" />
            Change Password
          </DialogTitle>
          <DialogDescription>
            Update your password. Choose a strong password that you don't use elsewhere.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        {...field} 
                        type={showCurrentPassword ? 'text' : 'password'} 
                        className="pr-10" 
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-10 w-10"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        disabled={isSubmitting}
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showCurrentPassword ? 'Hide password' : 'Show password'}
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        {...field} 
                        type={showNewPassword ? 'text' : 'password'} 
                        className="pr-10" 
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-10 w-10"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        disabled={isSubmitting}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showNewPassword ? 'Hide password' : 'Show password'}
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                  
                  {watchPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>Password strength:</span>
                        <span className={passwordStrength >= 70 ? 'text-green-500' : passwordStrength >= 40 ? 'text-amber-500' : 'text-destructive'}>
                          {getStrengthMessage(passwordStrength)}
                        </span>
                      </div>
                      <Progress value={passwordStrength} className={`h-1 ${getStrengthColor(passwordStrength)}`} />
                      
                      <Alert variant="outline" className="mt-3 py-2">
                        <ShieldAlert className="h-4 w-4" />
                        <AlertTitle className="text-xs font-medium">Password Requirements</AlertTitle>
                        <AlertDescription className="text-xs">
                          <ul className="list-inside list-disc space-y-1 mt-1">
                            <li className={watchPassword.length >= 8 ? 'text-green-500' : ''}>
                              At least 8 characters
                            </li>
                            <li className={/[A-Z]/.test(watchPassword) ? 'text-green-500' : ''}>
                              One uppercase letter
                            </li>
                            <li className={/[a-z]/.test(watchPassword) ? 'text-green-500' : ''}>
                              One lowercase letter
                            </li>
                            <li className={/[0-9]/.test(watchPassword) ? 'text-green-500' : ''}>
                              One number
                            </li>
                            <li className={/[^A-Za-z0-9]/.test(watchPassword) ? 'text-green-500' : ''}>
                              One special character
                            </li>
                          </ul>
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        {...field} 
                        type={showConfirmPassword ? 'text' : 'password'} 
                        className="pr-10" 
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-10 w-10"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isSubmitting}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showConfirmPassword ? 'Hide password' : 'Show password'}
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Changing Password...' : 'Change Password'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

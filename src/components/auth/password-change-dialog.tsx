
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Check, Eye, EyeOff, X } from 'lucide-react';
import { PasswordStrengthMeter } from './password-strength-meter';

interface PasswordChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export const PasswordChangeDialog: React.FC<PasswordChangeDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const { changePassword } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  
  const { register, handleSubmit, formState: { errors }, watch, reset } = form;
  
  const watchNewPassword = watch('newPassword');
  
  // Calculate password strength whenever the password changes
  React.useEffect(() => {
    if (!watchNewPassword) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    
    // Length check
    if (watchNewPassword.length >= 8) strength += 1;
    if (watchNewPassword.length >= 12) strength += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(watchNewPassword)) strength += 1;
    if (/[a-z]/.test(watchNewPassword)) strength += 1;
    if (/[0-9]/.test(watchNewPassword)) strength += 1;
    if (/[^A-Za-z0-9]/.test(watchNewPassword)) strength += 1;
    
    // Normalize to a scale of 0-100
    setPasswordStrength(Math.min(100, Math.round((strength / 6) * 100)));
  }, [watchNewPassword]);
  
  const onSubmit = async (data: PasswordFormValues) => {
    setIsSubmitting(true);
    try {
      await changePassword(data.currentPassword, data.newPassword);
      
      reset();
      onOpenChange(false);
      
      toast({
        title: 'Password changed',
        description: 'Your password has been changed successfully.',
      });
    } catch (error) {
      console.error('Password change error:', error);
      
      toast({
        title: 'Password change failed',
        description: 'Please check your current password and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleClose = () => {
    reset();
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Create a new password that is secure and easy to remember.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder="Enter your current password"
                {...register('currentPassword')}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm font-medium text-destructive flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.currentPassword.message}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newPassword">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Create a new password"
                {...register('newPassword')}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
            {errors.newPassword && (
              <p className="text-sm font-medium text-destructive flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.newPassword.message}
              </p>
            )}
            
            {watchNewPassword && (
              <div className="mt-2 space-y-2">
                <PasswordStrengthMeter strength={passwordStrength} />
                
                <ul className="space-y-1 text-xs">
                  <PasswordRequirement 
                    met={watchNewPassword.length >= 8}
                    text="At least 8 characters"
                  />
                  <PasswordRequirement 
                    met={/[A-Z]/.test(watchNewPassword)}
                    text="At least one uppercase letter"
                  />
                  <PasswordRequirement 
                    met={/[a-z]/.test(watchNewPassword)}
                    text="At least one lowercase letter"
                  />
                  <PasswordRequirement 
                    met={/[0-9]/.test(watchNewPassword)}
                    text="At least one number"
                  />
                  <PasswordRequirement 
                    met={/[^A-Za-z0-9]/.test(watchNewPassword)}
                    text="At least one special character"
                  />
                </ul>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your new password"
                {...register('confirmPassword')}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm font-medium text-destructive flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current"></span>
                  Changing...
                </>
              ) : (
                'Change Password'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface PasswordRequirementProps {
  met: boolean;
  text: string;
}

const PasswordRequirement: React.FC<PasswordRequirementProps> = ({ met, text }) => {
  return (
    <li className={`flex items-center gap-1.5 ${met ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
      {met ? (
        <Check size={14} className="text-green-600 dark:text-green-400" />
      ) : (
        <X size={14} />
      )}
      {text}
    </li>
  );
};


import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck, AlertCircle, KeyRound } from 'lucide-react';

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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const mfaSchema = z.object({
  code: z
    .string()
    .min(6, { message: 'Verification code must be 6 digits' })
    .max(6, { message: 'Verification code must be 6 digits' })
    .regex(/^\d+$/, { message: 'Code must contain only numbers' }),
});

type MfaFormValues = z.infer<typeof mfaSchema>;

interface MfaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerify: (success: boolean) => void;
  email: string;
}

export function MfaDialog({ open, onOpenChange, onVerify, email }: MfaDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const maxAttempts = 3;

  const form = useForm<MfaFormValues>({
    resolver: zodResolver(mfaSchema),
    defaultValues: {
      code: '',
    },
  });

  const resetForm = () => {
    form.reset();
  };

  const onClose = () => {
    resetForm();
    onOpenChange(false);
  };

  // Handle lockout countdown
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isLocked && lockoutTime > 0) {
      timer = setInterval(() => {
        setLockoutTime((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLocked, lockoutTime]);

  const onSubmit = async (data: MfaFormValues) => {
    if (isLocked) return;
    
    setIsSubmitting(true);
    
    // In a real app, validate the MFA code against a service
    // For demo, we'll use '123456' as the valid code
    setTimeout(() => {
      const isValid = data.code === '123456';
      
      if (isValid) {
        toast({
          title: 'Verification successful',
          description: 'Your identity has been verified.',
          variant: 'default',
        });
        setAttempts(0);
        onVerify(true);
        onClose();
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= maxAttempts) {
          // Lock account for 30 seconds after 3 failed attempts
          setIsLocked(true);
          setLockoutTime(30);
          toast({
            title: 'Account temporarily locked',
            description: 'Too many failed attempts. Please try again in 30 seconds.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Verification failed',
            description: `Invalid code. ${maxAttempts - newAttempts} attempts remaining.`,
            variant: 'destructive',
          });
        }
        
        form.reset();
      }
      
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Two-factor Authentication
          </DialogTitle>
          <DialogDescription>
            We've sent a verification code to {email}. Please enter the 6-digit code to verify your identity.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        {...field} 
                        placeholder="123456" 
                        className="pl-10 text-center tracking-widest font-medium" 
                        maxLength={6}
                        disabled={isLocked || isSubmitting}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isLocked && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Account Locked</AlertTitle>
                <AlertDescription>
                  Too many failed attempts. Try again in {lockoutTime} seconds.
                </AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isLocked}>
                {isSubmitting ? 'Verifying...' : 'Verify'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

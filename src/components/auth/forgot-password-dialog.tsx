
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

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

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Must be a valid email' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ForgotPasswordDialog({ open, onOpenChange }: ForgotPasswordDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const resetForm = () => {
    form.reset();
    setSubmitState('idle');
    setErrorMessage('');
  };

  const onClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    setSubmitState('idle');
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Check if email exists in our mock user database
      const mockUsers = [
        'admin@example.com',
        'employee@example.com',
        'client@example.com'
      ];
      
      if (mockUsers.includes(data.email.toLowerCase())) {
        setSubmitState('success');
        toast({
          title: 'Reset email sent',
          description: `If ${data.email} exists in our system, you'll receive password reset instructions shortly.`,
        });
      } else {
        // For security reasons, we don't want to tell users if an email exists or not
        // But for the demo, we'll show a message
        setSubmitState('success');
        toast({
          title: 'Reset email sent',
          description: "If this email exists in our system, you'll receive password reset instructions shortly.",
          variant: 'default',
        });
      }
      
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset your password</DialogTitle>
          <DialogDescription>
            Enter your email address and we'll send you instructions to reset your password.
          </DialogDescription>
        </DialogHeader>

        {submitState === 'success' ? (
          <div className="py-6 space-y-4">
            <Alert variant="default" className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-900">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle>Email sent</AlertTitle>
              <AlertDescription>
                We've sent password reset instructions to your email address.
                Please check your inbox and follow the instructions.
              </AlertDescription>
            </Alert>
            <DialogFooter>
              <Button onClick={onClose}>Close</Button>
            </DialogFooter>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input {...field} placeholder="your@email.com" className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {submitState === 'error' && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {errorMessage || 'Something went wrong. Please try again.'}
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
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}

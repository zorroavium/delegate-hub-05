
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { ForgotPasswordDialog } from '@/components/auth/forgot-password-dialog';
import { MfaDialog } from '@/components/auth/mfa-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';

// Password requirements for validation
const passwordRequirements = {
  minLength: 8,
  requireLowercase: true,
  requireUppercase: true,
  requireNumber: true,
  requireSpecialChar: true,
};

// Login form schema with password requirements
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Must be a valid email' }),
  password: z.string().min(1, { message: 'Password is required' }),
  rememberMe: z.boolean().optional().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [mfaOpen, setMfaOpen] = useState(false);
  const [tempEmail, setTempEmail] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const maxLoginAttempts = 5;
  const [accountLocked, setAccountLocked] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Handle account lockout
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (accountLocked && lockoutTimer > 0) {
      timer = setInterval(() => {
        setLockoutTimer((prev) => {
          if (prev <= 1) {
            setAccountLocked(false);
            setLoginAttempts(0);
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
  }, [accountLocked, lockoutTimer]);

  // Form definition
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Handle MFA verification
  const handleMfaVerify = async (success: boolean) => {
    if (success) {
      setIsLoading(true);
      try {
        const success = await login(tempEmail, form.getValues().password, form.getValues().rememberMe || false);
        if (success) {
          navigate('/');
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setLoginError('MFA verification failed');
    }
  };

  // Form submission handler
  const onSubmit = async (data: LoginFormValues) => {
    if (accountLocked) return;
    
    setLoginError('');
    setIsLoading(true);
    
    try {
      // Simulate MFA requirement for admin@example.com
      if (data.email.toLowerCase() === 'admin@example.com') {
        setTempEmail(data.email);
        setMfaOpen(true);
        return;
      }
      
      const success = await login(data.email, data.password, data.rememberMe);
      
      if (success) {
        navigate('/');
      } else {
        // Increment failed login attempts
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        
        if (newAttempts >= maxLoginAttempts) {
          // Lock account for 60 seconds after 5 failed attempts
          setAccountLocked(true);
          setLockoutTimer(60);
          setLoginError(`Too many failed login attempts. Account locked for 60 seconds.`);
        } else {
          setLoginError(`Invalid credentials. ${maxLoginAttempts - newAttempts} attempts remaining before lockout.`);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <Lock className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">DelegateEase</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loginError && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Login Failed</AlertTitle>
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            )}
            
            {accountLocked && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Account Locked</AlertTitle>
                <AlertDescription>
                  Your account is temporarily locked. Try again in {lockoutTimer} seconds.
                </AlertDescription>
              </Alert>
            )}
            
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
                          <Input
                            {...field}
                            placeholder="your@email.com"
                            className="pl-10"
                            disabled={isLoading || accountLocked}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="pl-10 pr-10"
                            disabled={isLoading || accountLocked}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-10 w-10"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading || accountLocked}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {showPassword ? 'Hide password' : 'Show password'}
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
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading || accountLocked}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Remember me for 30 days</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || accountLocked}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              variant="link"
              className="w-full"
              onClick={() => setForgotPasswordOpen(true)}
              disabled={accountLocked}
            >
              Forgot your password?
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              <p>Demo Credentials:</p>
              <p className="font-medium">admin@example.com / admin123 <ShieldCheck className="inline h-4 w-4 text-amber-500" aria-label="Requires MFA" /></p>
              <p className="font-medium">employee@example.com / employee123</p>
              <p className="font-medium">client@example.com / client123</p>
            </div>
          </CardFooter>
        </Card>
      </div>
      <ForgotPasswordDialog
        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
      />
      <MfaDialog
        open={mfaOpen}
        onOpenChange={setMfaOpen}
        onVerify={handleMfaVerify}
        email={tempEmail}
      />
    </div>
  );
}

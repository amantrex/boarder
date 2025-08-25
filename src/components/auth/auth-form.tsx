'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Icons } from '@/components/icons/icons';

const formSchema = z.object({
  email: z.string().email({ message: 'PLEASE ENTER A VALID EMAIL.' }),
  password: z.string().min(8, { message: 'PASSWORD MUST BE AT LEAST 8 CHARACTERS.' }),
});

type UserFormValue = z.infer<typeof formSchema>;

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const { login, signup } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
  });

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
      toast({
        title: 'LOGIN SUCCESSFUL',
        description: 'REDIRECTING TO YOUR DASHBOARD...',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'AUTHENTICATION FAILED',
        description: 'PLEASE TRY AGAIN.',
      });
    }
  };

  const onSubmit = async (data: UserFormValue) => {
    setIsLoading(true);
    try {
      if (mode === 'login') {
        await login(data.email, data.password);
        router.push('/dashboard');
        toast({
          title: 'LOGIN SUCCESSFUL',
          description: 'REDIRECTING TO YOUR DASHBOARD...',
        });
      } else {
        await signup(data.email, data.password);
        toast({
          title: 'ACCOUNT CREATED',
          description: 'PLEASE LOG IN WITH YOUR NEW CREDENTIALS.',
        });
        router.push('/login');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'AUTHENTICATION FAILED',
        description: 'PLEASE CHECK YOUR CREDENTIALS AND TRY AGAIN.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="font-headline text-2xl font-bold uppercase tracking-wider">
          {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
        </h1>
        <p className="text-sm text-muted-foreground uppercase">
          {mode === 'login'
            ? 'Enter your credentials to access your account'
            : 'Enter your email below to create your account'}
        </p>
      </div>
      <div className="grid gap-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
              <Label htmlFor="email" className="uppercase">Email</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                {...register('email')}
                className="brutalist-border focus:border-primary"
              />
              {errors.email && (
                <p className="px-1 text-xs text-destructive">{errors.email.message}</p>
              )}
          </div>
          <div className="grid gap-2">
              <Label htmlFor="password"  className="uppercase">Password</Label>
              <Input
                id="password"
                placeholder="********"
                type="password"
                disabled={isLoading}
                {...register('password')}
                className="brutalist-border focus:border-primary"
              />
               {errors.password && (
                <p className="px-1 text-xs text-destructive">{errors.password.message}</p>
              )}
          </div>

          <Button disabled={isLoading} className="w-full uppercase brutalist-border" type="submit">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'login' ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button variant="outline" type="button" disabled={isLoading} onClick={handleGoogleSignIn}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}{' '}
          Google
        </Button>
      </div>
      <p className="px-8 text-center text-sm text-muted-foreground">
        {mode === 'login' ? (
          <>
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
              Sign Up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link href="/login" className="underline underline-offset-4 hover:text-primary">
              Sign In
            </Link>
          </>
        )}
      </p>
    </>
  );
}

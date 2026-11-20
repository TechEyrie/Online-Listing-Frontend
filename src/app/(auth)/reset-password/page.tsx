'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/lib/auth-api';
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/lib/validators';
import type { ApiErrorResponse } from '@/types/api';

function InvalidResetLink() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset link invalid</CardTitle>
        <CardDescription>
          This link is missing or incomplete. Open the full link from your email or request a new one.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button asChild className="w-full">
          <Link href="/forgot-password">Request a new reset link</Link>
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/login" className="text-primary hover:text-primary-hover">
            Back to login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email')?.trim() ?? '';
  const tokenParam = searchParams.get('token')?.trim() ?? '';
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const linkReady = useMemo(() => Boolean(emailParam && tokenParam), [emailParam, tokenParam]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: emailParam,
      token: tokenParam,
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (emailParam) setValue('email', emailParam);
    if (tokenParam) setValue('token', tokenParam);
  }, [emailParam, tokenParam, setValue]);

  if (!linkReady) {
    return <InvalidResetLink />;
  }

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setServerError(null);
    try {
      await authApi.resetPassword({
        email: values.email,
        token: values.token,
        password: values.password,
      });
      router.push('/login');
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      setServerError(axiosError.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
        <CardDescription>Choose a new password for {emailParam}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <input type="hidden" {...register('email')} />
          <input type="hidden" {...register('token')} />
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className="pr-11"
                {...register('password')}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0.5 top-0.5 h-10 w-10"
                aria-label={showPassword ? 'Hide password' : 'Reveal password'}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className="pr-11"
                {...register('confirmPassword')}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0.5 top-0.5 h-10 w-10"
                aria-label={showConfirmPassword ? 'Hide password' : 'Reveal password'}
                onClick={() => setShowConfirmPassword((v) => !v)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>
          {serverError && <p className="text-sm text-destructive">{serverError}</p>}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Resetting...' : 'Reset password'}
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          <Link href="/login" className="text-primary hover:text-primary-hover">
            Back to login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <Card>
          <CardContent className="p-6">Loading...</CardContent>
        </Card>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
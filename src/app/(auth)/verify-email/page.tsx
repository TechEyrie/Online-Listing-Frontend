'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/lib/auth-api';
import { verifyEmailSchema, type VerifyEmailFormValues } from '@/lib/validators';
import type { ApiErrorResponse } from '@/types/api';

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get('email') || '';
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { email: emailFromQuery, otp: '' },
  });

  const onSubmit = async (values: VerifyEmailFormValues) => {
    setServerError(null);
    setSuccess(null);
    try {
      await authApi.verifyEmail(values);
      setSuccess('Email verified successfully. You can now continue.');
      router.push('/dashboard');
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      setServerError(axiosError.response?.data?.message || 'Verification failed');
    }
  };

  const onResend = async () => {
    setResending(true);
    setServerError(null);
    setSuccess(null);
    try {
      await authApi.resendVerification(getValues('email'));
      setSuccess('If eligible, a new verification code has been sent.');
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      setServerError(axiosError.response?.data?.message || 'Could not resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify your email</CardTitle>
        <CardDescription>Enter the 6-digit code sent to your inbox.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="otp">Verification code</Label>
            <Input id="otp" inputMode="numeric" maxLength={6} {...register('otp')} />
            {errors.otp && <p className="text-sm text-destructive">{errors.otp.message}</p>}
          </div>
          {serverError && <p className="text-sm text-destructive">{serverError}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Verifying...' : 'Verify email'}
          </Button>
        </form>
        <div className="mt-4 flex flex-col gap-2 text-sm">
          <button
            type="button"
            className="text-left text-muted-foreground hover:text-foreground"
            onClick={() => void onResend()}
            disabled={resending}
          >
            {resending ? 'Sending...' : 'Resend code'}
          </button>
          <Link href="/login" className="text-muted-foreground hover:text-foreground">
            Back to login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <Card>
          <CardContent className="p-6">Loading...</CardContent>
        </Card>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}

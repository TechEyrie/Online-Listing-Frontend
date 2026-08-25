'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';

import { AvatarUpload } from '@/components/profile/avatar-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { userApi } from '@/lib/user-api';
import { profileSchema, type ProfileFormValues } from '@/lib/validators';
import { useAuthStore } from '@/stores/auth-store';
import type { ApiErrorResponse } from '@/types/api';
import type { AuthUser } from '@/types/auth';

interface ProfileFormProps {
  user: AuthUser;
}

const emptyToUndefined = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

export function ProfileForm({ user }: ProfileFormProps) {
  const setUser = useAuthStore((s) => s.setUser);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      bio: user.bio || '',
      phone: user.phone || '',
      location: {
        city: user.location?.city || '',
        state: user.location?.state || '',
        country: user.location?.country || '',
      },
      socialLinks: {
        facebook: user.socialLinks?.facebook || '',
        twitter: user.socialLinks?.twitter || '',
        instagram: user.socialLinks?.instagram || '',
        linkedin: user.socialLinks?.linkedin || '',
      },
      agencyDetails: {
        name: user.agencyDetails?.name || '',
        license: user.agencyDetails?.license || '',
        website: user.agencyDetails?.website || '',
      },
      companyDetails: {
        name: user.companyDetails?.name || '',
        registrationNo: user.companyDetails?.registrationNo || '',
        website: user.companyDetails?.website || '',
      },
    },
  });

  useEffect(() => {
    reset({
      name: user.name,
      bio: user.bio || '',
      phone: user.phone || '',
      location: {
        city: user.location?.city || '',
        state: user.location?.state || '',
        country: user.location?.country || '',
      },
      socialLinks: {
        facebook: user.socialLinks?.facebook || '',
        twitter: user.socialLinks?.twitter || '',
        instagram: user.socialLinks?.instagram || '',
        linkedin: user.socialLinks?.linkedin || '',
      },
      agencyDetails: user.agencyDetails,
      companyDetails: user.companyDetails,
    });
  }, [user, reset]);

  const onSubmit = async (values: ProfileFormValues) => {
    setServerError(null);
    setSuccess(null);
    try {
      const payload = {
        name: values.name,
        bio: emptyToUndefined(values.bio),
        phone: emptyToUndefined(values.phone),
        location: {
          city: emptyToUndefined(values.location?.city),
          state: emptyToUndefined(values.location?.state),
          country: emptyToUndefined(values.location?.country),
        },
        socialLinks: {
          facebook: emptyToUndefined(values.socialLinks?.facebook),
          twitter: emptyToUndefined(values.socialLinks?.twitter),
          instagram: emptyToUndefined(values.socialLinks?.instagram),
          linkedin: emptyToUndefined(values.socialLinks?.linkedin),
        },
        ...(user.role === 'agent'
          ? {
              agencyDetails: {
                name: emptyToUndefined(values.agencyDetails?.name),
                license: emptyToUndefined(values.agencyDetails?.license),
                website: emptyToUndefined(values.agencyDetails?.website),
              },
            }
          : {}),
        ...(user.role === 'brand'
          ? {
              companyDetails: {
                name: emptyToUndefined(values.companyDetails?.name),
                registrationNo: emptyToUndefined(values.companyDetails?.registrationNo),
                website: emptyToUndefined(values.companyDetails?.website),
              },
            }
          : {}),
      };

      const res = await userApi.updateProfile(payload);
      setUser(res.data);
      setSuccess('Profile updated');
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      setServerError(axiosError.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="space-y-6">
      <AvatarUpload
        avatarUrl={user.avatar}
        name={user.name}
        onUploaded={(avatar) => setUser({ ...user, avatar })}
      />

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...register('bio')}
          />
          {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register('phone')} />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" {...register('location.city')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input id="state" {...register('location.state')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input id="country" {...register('location.country')} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook</Label>
            <Input id="facebook" {...register('socialLinks.facebook')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter</Label>
            <Input id="twitter" {...register('socialLinks.twitter')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input id="instagram" {...register('socialLinks.instagram')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input id="linkedin" {...register('socialLinks.linkedin')} />
          </div>
        </div>

        {user.role === 'agent' && (
          <div className="space-y-3 rounded-md border p-4">
            <h3 className="font-medium">Agency details</h3>
            <Input placeholder="Agency name" {...register('agencyDetails.name')} />
            <Input placeholder="License" {...register('agencyDetails.license')} />
            <Input placeholder="Website" {...register('agencyDetails.website')} />
          </div>
        )}

        {user.role === 'brand' && (
          <div className="space-y-3 rounded-md border p-4">
            <h3 className="font-medium">Company details</h3>
            <Input placeholder="Company name" {...register('companyDetails.name')} />
            <Input placeholder="Registration no." {...register('companyDetails.registrationNo')} />
            <Input placeholder="Website" {...register('companyDetails.website')} />
          </div>
        )}

        {serverError && <p className="text-sm text-destructive">{serverError}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save profile'}
        </Button>
      </form>
    </div>
  );
}

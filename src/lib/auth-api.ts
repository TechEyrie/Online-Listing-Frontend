import api from '@/lib/api';
import type { ApiSuccessResponse } from '@/types/api';
import type { AuthTokensData, AuthUser } from '@/types/auth';
import type {
  ForgotPasswordFormValues,
  LoginFormValues,
  RegisterFormValues,
  ResetPasswordFormValues,
  VerifyEmailFormValues,
} from '@/lib/validators';

export const authApi = {
  register: async (payload: RegisterFormValues) => {
    const { data } = await api.post<ApiSuccessResponse<AuthTokensData>>('/auth/register', payload);
    return data;
  },
  login: async (payload: LoginFormValues) => {
    const { data } = await api.post<ApiSuccessResponse<AuthTokensData>>('/auth/login', payload);
    return data;
  },
  logout: async () => {
    const { data } = await api.post<ApiSuccessResponse<null>>('/auth/logout');
    return data;
  },
  me: async () => {
    const { data } = await api.get<ApiSuccessResponse<AuthUser>>('/auth/me');
    return data;
  },
  refresh: async () => {
    const { data } = await api.post<ApiSuccessResponse<{ accessToken: string; user: AuthUser }>>(
      '/auth/refresh',
    );
    return data;
  },
  verifyEmail: async (payload: VerifyEmailFormValues) => {
    const { data } = await api.post<ApiSuccessResponse<null>>('/auth/verify-email', payload);
    return data;
  },
  resendVerification: async (email: string) => {
    const { data } = await api.post<ApiSuccessResponse<null>>('/auth/resend-verification', {
      email,
    });
    return data;
  },
  forgotPassword: async (payload: ForgotPasswordFormValues) => {
    const { data } = await api.post<ApiSuccessResponse<null>>('/auth/forgot-password', payload);
    return data;
  },
  resetPassword: async (payload: Omit<ResetPasswordFormValues, 'confirmPassword'>) => {
    const { data } = await api.post<ApiSuccessResponse<null>>('/auth/reset-password', payload);
    return data;
  },
  googleLogin: async (idToken: string) => {
    const { data } = await api.post<ApiSuccessResponse<AuthTokensData>>('/auth/google', {
      idToken,
    });
    return data;
  },
};

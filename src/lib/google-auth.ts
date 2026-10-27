export const isGoogleSignInConfigured = (): boolean => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  return Boolean(clientId && !clientId.includes('your-google'));
};

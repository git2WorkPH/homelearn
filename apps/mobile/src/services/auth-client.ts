import { expoClient } from '@better-auth/expo/client';
import { createAuthClient } from 'better-auth/react';
import * as SecureStore from 'expo-secure-store';

const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:3000';

export const authClient = createAuthClient({
  baseURL: `${apiUrl}/api/auth`,
  plugins: [expoClient({ scheme: 'homelearn', storagePrefix: 'homelearn', storage: SecureStore })],
});

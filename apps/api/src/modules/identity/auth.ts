import { expo } from '@better-auth/expo';
import { prismaAdapter } from '@better-auth/prisma-adapter';
import { betterAuth } from 'better-auth';
import type { PrismaClient } from '../../generated/prisma/client.js';

export type HomeLearnAuth = ReturnType<typeof createHomeLearnAuth>;

export function createHomeLearnAuth(input: {
  readonly prisma: PrismaClient;
  readonly secret: string;
  readonly baseURL: string;
  readonly allowProvisioning?: boolean;
}) {
  return betterAuth({
    appName: 'HomeLearn',
    baseURL: input.baseURL,
    basePath: '/api/auth',
    secret: input.secret,
    database: prismaAdapter(input.prisma, { provider: 'postgresql' }),
    emailAndPassword: {
      enabled: true,
      disableSignUp: input.allowProvisioning !== true,
      autoSignIn: false,
      minPasswordLength: 12,
      maxPasswordLength: 128,
    },
    plugins: [expo()],
    trustedOrigins: ['homelearn://', ...(process.env.NODE_ENV === 'development' ? ['exp://**'] : [])],
    advanced: { useSecureCookies: process.env.NODE_ENV === 'production' },
    rateLimit: {
      enabled: true,
      window: 60,
      max: 100,
      customRules: { '/sign-in/email': { window: 60, max: 5 } },
    },
  });
}

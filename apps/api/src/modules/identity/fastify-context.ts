import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { fromNodeHeaders } from 'better-auth/node';
import type { PrismaClient } from '../../generated/prisma/client.js';
import type { HomeLearnAuth } from './auth.js';

declare module 'fastify' {
  interface FastifyRequest {
    homeLearnActor?: { readonly userId: string; readonly familyId: string };
  }
}

export function registerAuthRoutes(app: FastifyInstance, auth: HomeLearnAuth, baseURL: string): void {
  app.route({
    method: ['GET', 'POST'],
    url: '/api/auth/*',
    async handler(request, reply) {
      const url = new URL(request.url, baseURL);
      const headers = fromNodeHeaders(request.headers);
      headers.delete('content-length');
      headers.delete('transfer-encoding');
      headers.delete('host');
      headers.delete('connection');
      headers.delete('keep-alive');
      headers.delete('proxy-authenticate');
      headers.delete('proxy-authorization');
      headers.delete('te');
      headers.delete('trailer');
      headers.delete('upgrade');
      headers.delete('x-forwarded-for');
      headers.set('x-forwarded-for', request.ip);
      const webRequest = new Request(url, {
        method: request.method,
        headers,
        ...(request.body === undefined || request.method === 'GET' || request.method === 'HEAD'
          ? {}
          : { body: JSON.stringify(request.body) }),
      });
      try {
        const response = await auth.handler(webRequest);
        reply.status(response.status);
        response.headers.forEach((value, key) => {
          if (key !== 'set-cookie') reply.header(key, value);
        });
        const cookies = response.headers.getSetCookie();
        if (cookies.length > 0) reply.header('set-cookie', cookies);
        return reply.send(response.body === null ? null : await response.text());
      } catch {
        return reply.code(500).send({ error: 'AUTHENTICATION_UNAVAILABLE' });
      }
    },
  });
}

export function registerFamilyAuthorization(
  app: FastifyInstance,
  auth: HomeLearnAuth | undefined,
  prisma: PrismaClient | undefined,
): void {
  app.addHook('preHandler', async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.url.startsWith('/api/v1/') || request.url.startsWith('/api/v1/catalogue/')) return;
    if (auth === undefined || prisma === undefined) return reply.code(401).send({ error: 'UNAUTHENTICATED' });

    const session = await auth.api.getSession({ headers: fromNodeHeaders(request.headers) });
    if (session === null) return reply.code(401).send({ error: 'UNAUTHENTICATED' });

    const memberships = await prisma.familyMember.findMany({
      where: { userId: session.user.id },
      select: { familyId: true },
      take: 2,
    });
    if (memberships.length !== 1) return reply.code(403).send({ error: 'FAMILY_CONTEXT_UNAVAILABLE' });

    const membership = memberships[0];
    if (membership === undefined) return reply.code(403).send({ error: 'FAMILY_CONTEXT_UNAVAILABLE' });
    request.homeLearnActor = { userId: session.user.id, familyId: membership.familyId };
  });
}

export function requireHomeLearnActor(request: FastifyRequest): { readonly userId: string; readonly familyId: string } {
  const actor = request.homeLearnActor;
  if (actor === undefined) throw new Error('AUTHORIZATION_CONTEXT_MISSING');
  return actor;
}

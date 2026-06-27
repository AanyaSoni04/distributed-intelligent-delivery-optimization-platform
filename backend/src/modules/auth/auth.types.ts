import { FastifyRequest, FastifyReply } from 'fastify';
import { Role } from '@prisma/client';

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}

declare module 'fastify' {
  interface FastifyRequest {
    user: JwtPayload;
  }
}

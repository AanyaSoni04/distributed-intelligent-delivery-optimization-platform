import { FastifyRequest, FastifyReply } from 'fastify';
import { Role } from '@prisma/client';
import '@fastify/jwt';

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JwtPayload;
    user: JwtPayload;
  }
}

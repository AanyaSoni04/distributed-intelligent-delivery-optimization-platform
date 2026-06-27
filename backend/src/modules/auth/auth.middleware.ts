import { FastifyRequest, FastifyReply } from 'fastify';
import { Role } from '@prisma/client';
import { error } from '../../shared/utils/api-response';

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    return reply.code(401).send(error('Unauthorized'));
  }
};

export const authorize = (roles: Role[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const userRole = request.user?.role;
    if (!userRole || !roles.includes(userRole)) {
      return reply.code(403).send(error('Forbidden: Insufficient permissions'));
    }
  };
};

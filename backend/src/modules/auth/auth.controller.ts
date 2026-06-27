import { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from './auth.service';
import { registerSchema, loginSchema } from './auth.schema';
import { success, error } from '../../shared/utils/api-response';
import { JwtPayload } from './auth.types';

export class AuthController {
  async registerHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      const parsedBody = registerSchema.safeParse(request.body);
      if (!parsedBody.success) {
        return reply.code(400).send(error('Validation failed', { errors: parsedBody.error.format() }));
      }

      const user = await authService.register(parsedBody.data);
      
      return reply.code(201).send(
        success('User registered successfully', {
          id: user.id,
          email: user.email,
          role: user.role,
        })
      );
    } catch (err: any) {
      return reply.code(400).send(error(err.message));
    }
  }

  async loginHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      const parsedBody = loginSchema.safeParse(request.body);
      if (!parsedBody.success) {
        return reply.code(400).send(error('Validation failed', { errors: parsedBody.error.format() }));
      }

      const user = await authService.login(parsedBody.data);
      
      const payload: JwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const token = request.server.jwt.sign(payload, { expiresIn: '1h' });

      return reply.code(200).send(
        success(
          'Login successful',
          {
            accessToken: token,
            expiresIn: 3600,
            user: {
              id: user.id,
              email: user.email,
              role: user.role,
            },
          }
        )
      );
    } catch (err: any) {
      return reply.code(401).send(error(err.message));
    }
  }

  async meHandler(request: FastifyRequest, reply: FastifyReply) {
    return reply.code(200).send(
      success('User profile retrieved', {
        id: request.user.userId,
        email: request.user.email,
        role: request.user.role,
      })
    );
  }
}

export const authController = new AuthController();

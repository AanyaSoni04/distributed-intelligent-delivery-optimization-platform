import fp from 'fastify-plugin';
import { FastifyPluginAsync, FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

const errorHandlerPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.setErrorHandler(function (error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
    this.log.error(error);

    if (error instanceof ZodError) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Validation failed',
        details: error.issues,
      });
    }

    const statusCode = error.statusCode || 500;
    const message = statusCode === 500 ? 'Internal Server Error' : error.message;

    reply.status(statusCode).send({
      statusCode,
      error: error.name,
      message,
    });
  });
};

export default fp(errorHandlerPlugin);

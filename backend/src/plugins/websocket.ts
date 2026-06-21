import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import fastifyWebsocket from '@fastify/websocket';

const websocketPlugin: FastifyPluginAsync = async (fastify, options) => {
  // Register the official @fastify/websocket plugin
  await fastify.register(fastifyWebsocket, {
    options: {
      maxPayload: 1048576, // 1 MB
    },
  });

  // Future implementation for tracking and other real-time features
  // fastify.get('/ws/tracking', { websocket: true }, (connection, req) => { ... });
};

export default fp(websocketPlugin);

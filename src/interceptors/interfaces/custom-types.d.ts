import { FastifyReply } from 'fastify';

declare module 'fastify' {
  interface FastifyReply {
    requestContext?: {
      start: bigint;
    };
  }
}
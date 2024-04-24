import 'fastify';

declare module 'fastify' {
  export interface FastifyReply {
    requestStartTime?: bigint;
  }
}
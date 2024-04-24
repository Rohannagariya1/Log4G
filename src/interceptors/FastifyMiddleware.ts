import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import logger from '../logger/GroMoLogger';

export async function logMiddleware(fastify: FastifyInstance, options: any) {
    console.log("Middleware registered");
    fastify.addHook('onRequest', async (request, reply) => {
        console.log("hello world rohan");
        logger.http(`Received request for ${request.url} at ${new Date().toISOString()}`);
        // No need to call done() because we're using async/await
    });
    // No done() call needed at this level, the async function handles it
}
 

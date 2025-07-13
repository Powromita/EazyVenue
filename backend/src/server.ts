import Fastify from 'fastify';
import { ApolloServer } from '@apollo/server';
import fastifyApollo from '@as-integrations/fastify';
import { typeDefs, resolvers } from './graphql/schema';
import prismaPlugin from './utils/prisma';
import vendorVenuesRoutes from './routes/vendorVenues';
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import authRoutes from './routes/auth';

const fastify = Fastify({ logger: true });
fastify.register(prismaPlugin);
fastify.register(cors, { origin: true, credentials: true });
fastify.register(fastifyJwt, { secret: process.env.JWT_SECRET || 'supersecret' });


fastify.addHook('preHandler', async (request, reply) => {
  // Allow unauthenticated access to auth endpoints
  if (request.url.startsWith('/api/auth/')) return;
  try {
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Missing or invalid Authorization header' });
    }
    const token = authHeader.slice(7);
    const user = fastify.jwt.verify(token);
    (request as any).user = user;
  } catch (err) {
    return reply.status(401).send({ error: 'Invalid or expired token' });
  }
});

fastify.register(vendorVenuesRoutes);
fastify.register(authRoutes);

async function startServer() {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await apolloServer.start();
  fastify.register(fastifyApollo(apolloServer));

  try {
    const address = await fastify.listen({ port: Number(process.env.PORT) || 5000 });
    fastify.log.info(`Server listening at ${address}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

startServer();
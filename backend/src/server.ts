import Fastify from 'fastify';
import { ApolloServer } from '@apollo/server';
import fastifyApollo from '@as-integrations/fastify';
import { typeDefs, resolvers } from './graphql/schema';
import prismaPlugin from './utils/prisma';
import vendorVenuesRoutes from './routes/vendorVenues';
import bookingRoutes from './routes/bookings';
import venueRoutes from './routes/venues';
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import authRoutes from './routes/auth';
import { Server as SocketIOServer } from 'socket.io';
import { createServer } from 'http';

const fastify = Fastify({ logger: true });
fastify.register(prismaPlugin);
fastify.register(cors, { 
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], 
  credentials: true,
});
fastify.register(fastifyJwt, { secret: process.env.JWT_SECRET || 'supersecret' });

fastify.addHook('preHandler', async (request, reply) => {
  // Allow unauthenticated access to auth endpoints, booking endpoints, and venue endpoints
  if (request.url.startsWith('/api/auth/') || request.url.startsWith('/api/bookings') || request.url.startsWith('/api/venues')) return;
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
fastify.register(bookingRoutes);
fastify.register(venueRoutes);

async function startServer() {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await apolloServer.start();
  fastify.register(fastifyApollo(apolloServer));

  try {
    // Start Fastify first
    const address = await fastify.listen({ port: Number(process.env.PORT) || 5000 });
    fastify.log.info(`Server listening at ${address}`);

    // Create HTTP server and attach Socket.IO
    const server = createServer(fastify.server);
    
    // Initialize Socket.IO
    const io = new SocketIOServer(server, {
      cors: {
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
        credentials: true,
      },
    });

    // Attach Socket.IO to fastify instance
    (fastify as any).io = io;

    // Socket.IO connection handling
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Join venue room for real-time updates
      socket.on('join-venue', (venueId: string) => {
        socket.join(`venue-${venueId}`);
        console.log(`Client ${socket.id} joined venue ${venueId}`);
      });

      // Leave venue room
      socket.on('leave-venue', (venueId: string) => {
        socket.leave(`venue-${venueId}`);
        console.log(`Client ${socket.id} left venue ${venueId}`);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    fastify.log.info(`Socket.IO server ready`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

startServer();
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
import fastifySocketIO from 'fastify-socket.io';
import { createServer } from 'http';

const fastify = Fastify({ logger: true });
fastify.register(prismaPlugin);
fastify.register(cors, { 
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], 
  credentials: true,
});
fastify.register(fastifyJwt, { secret: process.env.JWT_SECRET || 'supersecret' });
fastify.register(fastifySocketIO, {
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  },
});

// Add authenticate decorator for JWT-protected routes
fastify.decorate('authenticate', async function(request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
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
    const address = await fastify.listen({ port: Number(process.env.PORT) || 5000 });
    fastify.log.info(`Server listening at ${address}`);

    // Socket.IO connection handling using fastify-socket.io
    fastify.io.on('connection', (socket) => {
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
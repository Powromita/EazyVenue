import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export default async function venueRoutes(fastify: FastifyInstance) {
  // Get venue by ID
  fastify.get('/api/venues/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;

      // @ts-ignore: prisma is decorated on fastify instance
      const venue = await fastify.prisma.venue.findUnique({
        where: { id },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!venue) {
        return reply.status(404).send({ error: 'Venue not found' });
      }

      return reply.send({ venue });
    } catch (error) {
      console.error('Error fetching venue:', error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Get venue availability
  fastify.get('/api/venues/:id/availability', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;

      // Check if venue exists
      // @ts-ignore: prisma is decorated on fastify instance
      const venue = await fastify.prisma.venue.findUnique({
        where: { id },
      });

      if (!venue) {
        return reply.status(404).send({ error: 'Venue not found' });
      }

      // Get availability for the next 30 days
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);

      // @ts-ignore: prisma is decorated on fastify instance
      const availability = await fastify.prisma.availability.findMany({
        where: {
          venueId: id,
          date: {
            gte: today,
            lte: thirtyDaysFromNow,
          },
        },
        orderBy: {
          date: 'asc',
        },
      });

      return reply.send({ availability });
    } catch (error) {
      console.error('Error fetching venue availability:', error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Get all venues
  fastify.get('/api/venues', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // @ts-ignore: prisma is decorated on fastify instance
      const venues = await fastify.prisma.venue.findMany({
        where: {
          isPosted: true, // Only show posted venues
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return reply.send({ venues });
    } catch (error) {
      console.error('Error fetching venues:', error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Get bookings for a specific venue
  fastify.get('/api/venues/:id/bookings', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;

      // Check if venue exists
      // @ts-ignore: prisma is decorated on fastify instance
      const venue = await fastify.prisma.venue.findUnique({
        where: { id },
      });

      if (!venue) {
        return reply.status(404).send({ error: 'Venue not found' });
      }

      // Get bookings for this venue
      // @ts-ignore: prisma is decorated on fastify instance
      const bookings = await fastify.prisma.booking.findMany({
        where: { venueId: id },
        include: {
          venue: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return reply.send({ bookings });
    } catch (error) {
      console.error('Error fetching venue bookings:', error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
} 
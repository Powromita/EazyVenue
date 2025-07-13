import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { ZodError } from 'zod';

const venueSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  capacity: z.number().int().positive(),
  price: z.number().int().nonnegative(),
  contactNumber: z.string().optional(),
  occasion: z.string().optional(),
  images: z.array(z.string()).optional(),
  isPosted: z.boolean().optional(),
});

export default async function vendorVenuesRoutes(fastify: FastifyInstance) {
  // Get all venues for the logged-in vendor
  fastify.get('/api/vendor/venues', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // @ts-ignore: user is set by auth middleware
      const ownerId = (request as any).user.id;
      const venues = await fastify.prisma.venue.findMany({ where: { ownerId } });
      return venues;
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Create a new venue
  fastify.post('/api/vendor/venues', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // @ts-ignore: user is set by auth middleware
      const ownerId = (request as any).user.id;
      const parseResult = venueSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({ error: 'Invalid data', details: (parseResult.error as ZodError).errors });
      }
      const data = parseResult.data;
      const venue = await fastify.prisma.venue.create({ data: { ...data, ownerId } });
      return venue;
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Update a venue
  fastify.put('/api/vendor/venues/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // @ts-ignore: user is set by auth middleware
      const ownerId = (request as any).user.id;
      const { id } = request.params as { id: string };
      fastify.log.info({ id, ownerId }, 'Attempting to update venue');
      const venues = await fastify.prisma.venue.findMany({ where: { ownerId } });
      fastify.log.info({ venues }, 'Venues for this owner');
      const parseResult = venueSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({ error: 'Invalid data', details: (parseResult.error as ZodError).errors });
      }
      const data = parseResult.data;
      const updated = await fastify.prisma.venue.updateMany({
        where: { id, ownerId },
        data,
      });
      if (updated.count === 0) {
        return reply.status(404).send({ error: 'Venue not found or not owned by user' });
      }
      return { success: true };
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Delete a venue
  fastify.delete('/api/vendor/venues/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // @ts-ignore: user is set by auth middleware
      const ownerId = (request as any).user.id;
      const { id } = request.params as { id: string };
      const deleted = await fastify.prisma.venue.deleteMany({
        where: { id, ownerId },
      });
      if (deleted.count === 0) {
        return reply.status(404).send({ error: 'Venue not found or not owned by user' });
      }
      return { success: true };
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Get a single venue by ID for the logged-in vendor
  fastify.get('/api/vendor/venues/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // @ts-ignore: user is set by auth middleware
      const ownerId = (request as any).user?.id || 'mock-owner-id';
      const { id } = request.params as { id: string };
      const venue = await fastify.prisma.venue.findFirst({ where: { id, ownerId } });
      if (!venue) {
        return reply.status(404).send({ error: 'Venue not found or not owned by user' });
      }
      return venue;
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
}
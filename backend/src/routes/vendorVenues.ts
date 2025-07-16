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
  fastify.get('/api/vendor/venues', {
    preValidation: [(fastify as any).authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // @ts-ignore: user is set by auth middleware
      const ownerId = (request as any).user.id;
      const venues = await fastify.prisma.venue.findMany({ where: { ownerId }, include: { owner: true } });
      return venues;
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Create a new venue
  fastify.post('/api/vendor/venues', {
    preValidation: [(fastify as any).authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // @ts-ignore: user is set by auth middleware
      const ownerId = (request as any).user.id;
      const parseResult = venueSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({ error: 'Invalid data', details: (parseResult.error as ZodError).errors });
      }
      const data = parseResult.data;
      const venue = await fastify.prisma.venue.create({ data: { ...data, ownerId } });

      // Automatically create availability for the next 30 days
      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        await fastify.prisma.availability.create({
          data: {
            venueId: venue.id,
            date: date,
            status: 'AVAILABLE',
          },
        });
      }

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

  // Update vendor profile (current user)
  fastify.put('/api/vendor/profile', {
    preValidation: [(fastify as any).authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // @ts-ignore: user is set by auth middleware
      const userId = (request as any).user.id;
      const {
        businessName,
        contactPerson,
        email,
        phone,
        username,
        address,
        businessType,
        yearsInBusiness,
        description,
        website,
        venueTypes,
        capacityRange,
        amenities,
        bookingPolicies,
        availabilityStatus,
        gst,
        paymentMethods,
        pricingPackages,
        certifications,
        emergencyContact,
      } = request.body as any;

      // Helper to ensure value is always an array
      function ensureArray(val: any) {
        if (Array.isArray(val)) return val;
        if (typeof val === 'string') return val.split(',').map((v: string) => v.trim());
        if (val == null) return [];
        return [val];
      }

      let fixedVenueTypes = ensureArray(venueTypes);
      let fixedAmenities = ensureArray(amenities);
      let fixedPaymentMethods = ensureArray(paymentMethods);
      let fixedCertifications = ensureArray(certifications);

      // Build the data object
      const data: any = {
        name: username,
        email,
        phone,
        address,
        businessName,
        contactPerson,
        businessType,
        yearsInBusiness,
        description,
        website,
        venueTypes: fixedVenueTypes,
        capacityRange,
        amenities: fixedAmenities,
        bookingPolicies,
        availabilityStatus,
        gst,
        paymentMethods: fixedPaymentMethods,
        pricingPackages,
        certifications: fixedCertifications,
        emergencyContact,
      };

      // Debug log to verify data sent to Prisma
      console.log('Updating user with data:', data);

      // Update the user (vendor) record
      const updated = await (fastify as any).prisma.user.update({
        where: { id: userId },
        data,
      });
      return reply.send({ success: true, user: updated });
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Failed to update profile' });
    }
  });

  // Get vendor profile (current user)
  fastify.get('/api/vendor/profile', {
    preValidation: [(fastify as any).authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // @ts-ignore: user is set by auth middleware
      const userId = (request as any).user.id;
      // Fetch the vendor's user record
      const user = await (fastify as any).prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          businessName: true,
          contactPerson: true,
          businessType: true,
          yearsInBusiness: true,
          description: true,
          website: true,
          venueTypes: true,
          capacityRange: true,
          amenities: true,
          bookingPolicies: true,
          availabilityStatus: true,
          gst: true,
          paymentMethods: true,
          pricingPackages: true,
          certifications: true,
          emergencyContact: true,
        },
      });
      if (!user) {
        return reply.status(404).send({ error: 'Vendor not found' });
      }
      return reply.send(user);
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Failed to fetch profile' });
    }
  });
}
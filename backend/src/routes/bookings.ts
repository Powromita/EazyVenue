import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

// Validation schema for booking requests
const createBookingSchema = z.object({
  venueId: z.string(),
  eventDate: z.string(),
  eventTime: z.string(),
  guestCount: z.number().min(1),
  eventType: z.string(),
  contactName: z.string().min(1),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(1),
  specialRequests: z.string().optional(),
});

// Validation schema for booking confirmation
const confirmBookingSchema = z.object({
  status: z.enum(['CONFIRMED', 'CANCELLED']),
});

type CreateBookingRequest = z.infer<typeof createBookingSchema>;
type ConfirmBookingRequest = z.infer<typeof confirmBookingSchema>;

export default async function bookingRoutes(fastify: FastifyInstance) {
  // Create a new booking
  fastify.post('/api/bookings', async (request: FastifyRequest<{ Body: CreateBookingRequest }>, reply: FastifyReply) => {
    try {
      const bookingData = createBookingSchema.parse(request.body);

      // Check if venue exists
      // @ts-ignore: prisma is decorated on fastify instance
      const venue = await fastify.prisma.venue.findUnique({
        where: { id: bookingData.venueId },
      });

      if (!venue) {
        return reply.status(404).send({ error: 'Venue not found' });
      }

      // Check if venue capacity is sufficient
      if (bookingData.guestCount > venue.capacity) {
        return reply.status(400).send({ 
          error: `Venue capacity is ${venue.capacity} people, but you're trying to book for ${bookingData.guestCount} people` 
        });
      }

      // Check if the date is in the future
      const eventDate = new Date(bookingData.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (eventDate < today) {
        return reply.status(400).send({ error: 'Event date must be in the future' });
      }

      // Check for existing availability on this date
      // @ts-ignore: prisma is decorated on fastify instance
      const existingAvailability = await fastify.prisma.availability.findUnique({
        where: {
          venueId_date: {
            venueId: bookingData.venueId,
            date: eventDate,
          },
        },
      });

      if (existingAvailability && existingAvailability.status === 'BOOKED') {
        return reply.status(409).send({ error: 'Venue is already booked for this date' });
      }

      // Create or find a guest user for the booking
      // @ts-ignore: prisma is decorated on fastify instance
      let guestUser = await fastify.prisma.user.findFirst({
        where: { email: bookingData.contactEmail }
      });

      if (!guestUser) {
        // Create a guest user
        // @ts-ignore: prisma is decorated on fastify instance
        guestUser = await fastify.prisma.user.create({
          data: {
            email: bookingData.contactEmail,
            name: bookingData.contactName,
            password: 'guest-password', // In real app, this would be properly hashed
            role: 'USER',
          },
        });
      }

      // Create the booking
      // @ts-ignore: prisma is decorated on fastify instance
      const booking = await fastify.prisma.booking.create({
        data: {
          venueId: bookingData.venueId,
          userId: guestUser.id,
          eventDate: new Date(bookingData.eventDate),
          eventTime: bookingData.eventTime,
          guestCount: bookingData.guestCount,
          eventType: bookingData.eventType,
          contactName: bookingData.contactName,
          contactEmail: bookingData.contactEmail,
          contactPhone: bookingData.contactPhone,
          specialRequests: bookingData.specialRequests || '',
          status: 'CONFIRMED', // Auto-confirm all bookings
        },
        include: {
          venue: true,
        },
      });

      // Update venue availability immediately since booking is confirmed
      
      // Upsert availability record
      // @ts-ignore: prisma is decorated on fastify instance
      await fastify.prisma.availability.upsert({
        where: {
          venueId_date: {
            venueId: bookingData.venueId,
            date: eventDate,
          },
        },
        update: {
          status: 'BOOKED',
          bookingId: booking.id,
        },
        create: {
          venueId: bookingData.venueId,
          date: eventDate,
          status: 'BOOKED',
          bookingId: booking.id,
        },
      });

      // Emit real-time update for venue availability
      if ((fastify as any).io) {
        (fastify as any).io.to(`venue-${bookingData.venueId}`).emit('availability-updated', {
          venueId: bookingData.venueId,
          date: eventDate,
          status: 'BOOKED',
          bookingId: booking.id,
        });
      }

      return reply.status(201).send({
        message: 'Booking created and confirmed successfully',
        booking: {
          id: booking.id,
          venueName: booking.venue.name,
          eventDate: booking.eventDate,
          eventTime: booking.eventTime,
          guestCount: booking.guestCount,
          eventType: booking.eventType,
          status: booking.status,
        },
      });

    } catch (error) {
      console.error('Booking creation error:', error);
      
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ 
          error: 'Invalid booking data', 
          details: error.issues 
        });
      }

      // Log the full error for debugging
      console.error('Full error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });

      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Confirm or cancel a booking (updates availability automatically)
  fastify.patch('/api/bookings/:id/confirm', async (request: FastifyRequest<{ 
    Params: { id: string },
    Body: ConfirmBookingRequest
  }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;
      const { status } = request.body;

      // Get the booking with venue info
      // @ts-ignore: prisma is decorated on fastify instance
      const booking = await fastify.prisma.booking.findUnique({
        where: { id },
        include: {
          venue: true,
        },
      });

      if (!booking) {
        return reply.status(404).send({ error: 'Booking not found' });
      }

      // Update booking status
      // @ts-ignore: prisma is decorated on fastify instance
      const updatedBooking = await fastify.prisma.booking.update({
        where: { id },
        data: { status },
        include: {
          venue: true,
        },
      });

      // Update venue availability based on booking status
      const eventDate = booking.eventDate;
      const availabilityStatus = status === 'CONFIRMED' ? 'BOOKED' : 'AVAILABLE';

      // Upsert availability record
      // @ts-ignore: prisma is decorated on fastify instance
      await fastify.prisma.availability.upsert({
        where: {
          venueId_date: {
            venueId: booking.venueId,
            date: eventDate,
          },
        },
        update: {
          status: availabilityStatus,
          bookingId: status === 'CONFIRMED' ? booking.id : null,
        },
        create: {
          venueId: booking.venueId,
          date: eventDate,
          status: availabilityStatus,
          bookingId: status === 'CONFIRMED' ? booking.id : null,
        },
      });

      // Emit real-time update for venue availability
      if ((fastify as any).io) {
        (fastify as any).io.to(`venue-${booking.venueId}`).emit('availability-updated', {
          venueId: booking.venueId,
          date: eventDate,
          status: availabilityStatus,
          bookingId: booking.id,
        });
      }

      return reply.send({ 
        message: `Booking ${status.toLowerCase()} successfully`,
        booking: updatedBooking,
        availabilityUpdated: true,
      });
    } catch (error) {
      console.error('Error confirming booking:', error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Get all bookings (for admin/vendor use)
  fastify.get('/api/bookings', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // @ts-ignore: prisma is decorated on fastify instance
      const bookings = await fastify.prisma.booking.findMany({
        include: {
          venue: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return reply.send({ bookings });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Get user bookings by email (for customers)
  fastify.get('/api/bookings/user/:email', async (request: FastifyRequest<{ Params: { email: string } }>, reply: FastifyReply) => {
    try {
      const { email } = request.params;

      // Find user by email
      // @ts-ignore: prisma is decorated on fastify instance
      const user = await fastify.prisma.user.findFirst({
        where: { email },
      });

      if (!user) {
        return reply.status(404).send({ error: 'User not found' });
      }

      // Get bookings for this user
      // @ts-ignore: prisma is decorated on fastify instance
      const bookings = await fastify.prisma.booking.findMany({
        where: { userId: user.id },
        include: {
          venue: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return reply.send({ bookings });
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Get booking by ID
  fastify.get('/api/bookings/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;

      // @ts-ignore: prisma is decorated on fastify instance
      const booking = await fastify.prisma.booking.findUnique({
        where: { id },
        include: {
          venue: true,
        },
      });

      if (!booking) {
        return reply.status(404).send({ error: 'Booking not found' });
      }

      return reply.send({ booking });
    } catch (error) {
      console.error('Error fetching booking:', error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Update booking status (for admin/vendor use)
  fastify.patch('/api/bookings/:id/status', async (request: FastifyRequest<{ 
    Params: { id: string },
    Body: { status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' }
  }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;
      const { status } = request.body;

      // @ts-ignore: prisma is decorated on fastify instance
      const booking = await fastify.prisma.booking.update({
        where: { id },
        data: { status },
        include: {
          venue: true,
        },
      });

      return reply.send({ 
        message: 'Booking status updated successfully',
        booking 
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

} 
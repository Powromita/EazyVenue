import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAvailability() {
  const venues = await prisma.venue.findMany();
  const today = new Date();

  for (const venue of venues) {
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Check if availability already exists for this date
      const exists = await prisma.availability.findFirst({
        where: {
          venueId: venue.id,
          date: date,
        },
      });
      if (!exists) {
        await prisma.availability.create({
          data: {
            venueId: venue.id,
            date: date,
            status: 'AVAILABLE',
          },
        });
      }
    }
  }
  console.log('Availability seeded for all venues.');
}

seedAvailability().finally(() => prisma.$disconnect()); 
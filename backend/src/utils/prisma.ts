import fp from 'fastify-plugin';
import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';

const prismaPlugin = fp(async (fastify: FastifyInstance) => {
  const prisma = new PrismaClient();
  fastify.decorate('prisma', prisma);
});

export default prismaPlugin; 
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6),
  role: z.enum(['VENUE_OWNER', 'USER']),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default async function authRoutes(fastify: FastifyInstance) {
  // Register
  fastify.post('/api/auth/register', async (request: FastifyRequest, reply: FastifyReply) => {
    console.log('Registration request body:', request.body);
    
    const parseResult = registerSchema.safeParse(request.body);
    if (!parseResult.success) {
      console.log('Validation error:', parseResult.error.issues);
      return reply.status(400).send({ error: 'Invalid data', details: parseResult.error.issues });
    }
    
    const { email, name, password, role } = parseResult.data;
    console.log('Checking for existing user with email:', email);
    
    // @ts-ignore: prisma is decorated on fastify instance
    const existing = await fastify.prisma.user.findUnique({ where: { email } });
    console.log('Existing user found:', existing);
    
    if (existing) {
      return reply.status(400).send({ error: 'Email already registered' });
    }
    
    const hashed = await bcrypt.hash(password, 10);
    // @ts-ignore: prisma is decorated on fastify instance
    const user = await fastify.prisma.user.create({
      data: { email, name, password: hashed, role },
    });
    
    console.log('User created successfully:', { id: user.id, email: user.email, name: user.name, role: user.role });
    
    const token = fastify.jwt.sign({ id: user.id, email: user.email, role: user.role });
    return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  });

  // Login
  fastify.post('/api/auth/login', async (request: FastifyRequest, reply: FastifyReply) => {
    console.log('Login request body:', request.body);
    
    const parseResult = loginSchema.safeParse(request.body);
    if (!parseResult.success) {
      console.log('Login validation error:', parseResult.error.issues);
      return reply.status(400).send({ error: 'Invalid data', details: parseResult.error.issues });
    }
    
    const { email, password } = parseResult.data;
    console.log('Attempting login for email:', email);
    
    // @ts-ignore: prisma is decorated on fastify instance
    const user = await fastify.prisma.user.findUnique({ where: { email } });
    console.log('User found for login:', user ? { id: user.id, email: user.email } : 'Not found');
    
    if (!user) {
      return reply.status(401).send({ error: 'Invalid email or password' });
    }
    
    const valid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', valid);
    
    if (!valid) {
      return reply.status(401).send({ error: 'Invalid email or password' });
    }
    
    const token = fastify.jwt.sign({ id: user.id, email: user.email, role: user.role });
    return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  });
} 
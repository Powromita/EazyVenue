# EazyVenue Deployment Guide

## Overview
This guide covers deploying the EazyVenue application to various platforms.

## Prerequisites
- Node.js 18+
- PostgreSQL database
- Git

## Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@host:port/database"
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

## Deployment Options

### Option 1: Vercel (Recommended)

#### Backend Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set the root directory to `backend`
4. Configure environment variables in Vercel dashboard
5. Deploy

#### Frontend Deployment
1. Connect your repository to Vercel
2. Set the root directory to `frontend`
3. Configure environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend URL
4. Deploy

### Option 2: Docker Deployment

#### Local Development
```bash
# Start all services
docker-compose up -d

# Run database migrations
docker-compose exec backend npx prisma db push

# View logs
docker-compose logs -f
```

#### Production Deployment
```bash
# Build and run backend
cd backend
docker build -t eazyvenue-backend .
docker run -p 5000:5000 -e DATABASE_URL=your_db_url eazyvenue-backend

# Build and run frontend
cd frontend
docker build -t eazyvenue-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=your_backend_url eazyvenue-frontend
```

### Option 3: Manual Deployment

#### Backend Setup
1. Install dependencies: `npm install`
2. Set environment variables
3. Run database migrations: `npx prisma db push`
4. Build: `npm run build`
5. Start: `npm start`

#### Frontend Setup
1. Install dependencies: `npm install`
2. Set environment variables
3. Build: `npm run build`
4. Start: `npm start`

## Database Setup

### PostgreSQL (Recommended)
1. Create a PostgreSQL database
2. Update `DATABASE_URL` in backend environment
3. Run migrations: `npx prisma db push`

### Alternative: Supabase
1. Create a Supabase project
2. Get the connection string
3. Update `DATABASE_URL` in backend environment

## Environment Configuration

### Development
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`
- Database: Local PostgreSQL

### Production
- Backend: Your deployed backend URL
- Frontend: Your deployed frontend URL
- Database: Production PostgreSQL (Supabase, Railway, etc.)

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure `FRONTEND_URL` is set in backend environment
2. **Database Connection**: Verify `DATABASE_URL` is correct
3. **Build Errors**: Check Node.js version compatibility
4. **Environment Variables**: Ensure all required variables are set

### Logs
- Backend logs: Check server console or deployment platform logs
- Frontend logs: Check browser console or deployment platform logs

## Security Considerations
1. Use strong JWT secrets in production
2. Enable HTTPS in production
3. Set up proper CORS configuration
4. Use environment variables for sensitive data
5. Regularly update dependencies

## Performance Optimization
1. Enable database connection pooling
2. Use CDN for static assets
3. Implement caching strategies
4. Monitor application performance

## Monitoring
1. Set up error tracking (Sentry, etc.)
2. Monitor database performance
3. Track API response times
4. Set up uptime monitoring 
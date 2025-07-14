# Mini Venue Booking Dashboard

A comprehensive venue booking system that allows venue owners to manage their venues and users to book available venues.

## 🚀 Features

### Core Features
- **Venue Management**: Venue owners can add, view, and manage their venues
- **Availability Management**: Mark venues as unavailable for specific dates
- **Booking System**: Users can browse and book available venues
- **Real-time Updates**: Automatic availability updates after bookings

### Admin Interface
- Dashboard for venue owners to manage venues
- Add new venues with details (name, description, capacity, etc.)
- Block/unblock dates for venue availability
- View all bookings and venue status

### User Interface
- Browse available venues
- View venue details and availability
- Make bookings for available dates
- Search and filter venues

## Future Enhancements

### 1. User Search Activity Tracking

**Approach:**
- Implement analytics middleware to capture search queries, filters, and user behavior
- Store search patterns, time spent, and interaction data
- Create user behavior analytics dashboard
- Use this data for personalized recommendations and improved UX

**Benefits:**
- Understand user preferences and behavior
- Optimize search functionality
- Provide personalized venue suggestions
- Improve conversion rates

### 2. Admin Analytics Dashboard

**Features:**
- Revenue analytics and trends over time
- Popular venues and peak booking times
- User engagement metrics and conversion rates
- Geographic distribution of bookings
- Real-time booking statistics

**Technical Implementation:**
- Real-time data aggregation using database pipelines
- Interactive charts and visualizations
- WebSocket connections for live updates
- Export functionality for reports and analysis

### 3. Calendar View for Venue Availability

**Features:**
- Interactive calendar interface with drag-and-drop functionality
- Color-coded availability status (available, booked, blocked)
- Multi-month view with navigation
- Integration with external calendar systems
- Bulk date selection for availability management

**Benefits:**
- Intuitive booking experience
- Better availability management for venue owners
- Reduced booking errors
- Improved user experience

### 4. Authentication System

**Multi-level Authentication:**
- **Super Admin**: Full system access and user management
- **Venue Owner**: Manage their venues and view their bookings
- **Regular User**: Browse and book venues
- **Guest User**: View venues without booking capability

**Security Features:**
- JWT tokens with refresh mechanism for better security
- Role-based access control (RBAC) for granular permissions
- Password hashing with bcrypt for data protection
- Rate limiting for API endpoints to prevent abuse
- Session management with secure token storage

## 🛠️ Tech Stack

### Backend
- **Fastify** - High-performance web framework with excellent TypeScript support
- **PostgreSQL** - ACID-compliant relational database for complex queries
- **Prisma ORM** - Type-safe database operations and migrations
- **GraphQL with Apollo Server** - Flexible API with real-time subscriptions
- **WebSocket with Socket.io** - Real-time updates for instant availability changes

### Frontend
- **Next.js with TypeScript** - Server-side rendering with built-in API routes
- **Tailwind CSS + Headless UI** - Customizable and performant UI components
- **Zustand** - Simple and performant state management
- **Apollo Client** - GraphQL client with caching and real-time subscriptions

### Development Tools
- **date-fns** - Modern date utility library for date operations
- **Zod** - Type-safe validation with automatic TypeScript types
- **Jest + Testing Library** - Comprehensive testing framework
- **ESLint + Prettier** - Code quality and formatting

## 📁 Project Structure

```
EazyVenue/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── guards/
│   │   └── utils/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── stores/
│   │   └── utils/
│   ├── package.json
│   └── public/
├── README.md
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EazyVenue
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma db push
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Database Setup**
   - Ensure PostgreSQL is running
   - Create a `.env` file in the backend directory with:
     ```
     DATABASE_URL="postgresql://username:password@localhost:5432/eazyvenue"
     JWT_SECRET=your_jwt_secret
     JWT_REFRESH_SECRET=your_refresh_secret
     PORT=5000
     ```

## 📋 API Endpoints

### GraphQL Schema
- **Queries**: Fetch venues, bookings, and user data
- **Mutations**: Create/update venues, manage availability, create bookings
- **Subscriptions**: Real-time updates for venue availability changes

### REST Endpoints (for compatibility)
- `GET /api/venues` - Get all venues
- `POST /api/venues` - Add new venue
- `PUT /api/venues/:id/availability` - Update venue availability
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get all bookings

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Admin registration

## 🔧 Implementation Logic

### Database Design
- **PostgreSQL** for ACID compliance and complex queries
- **Prisma ORM** for type-safe database operations
- **Relational design** with proper foreign key constraints
- **Individual date records** for flexible availability management

### Authentication Logic
- **JWT tokens** with short expiration for security
- **Refresh tokens** for seamless user experience
- **Role-based access control** for granular permissions
- **Password hashing** with bcrypt for data protection

### State Management
- **Zustand** for simple and performant state management
- **TypeScript** for type safety throughout the application
- **Real-time updates** via WebSocket connections
- **Optimistic updates** for better user experience

### Error Handling
- **Custom error classes** with proper HTTP status codes
- **Validation middleware** for input sanitization
- **Graceful error recovery** with user-friendly messages
- **Logging and monitoring** for debugging

### Real-time Features
- **WebSocket connections** for instant updates
- **Room-based subscriptions** for venue-specific updates
- **Automatic reconnection** for network resilience
- **Event-driven architecture** for scalability

## 🧪 Testing Strategy

### Unit Testing
- **Jest** for test framework
- **Testing Library** for component testing
- **MSW** for API mocking
- **Coverage reporting** for quality assurance

### Integration Testing
- **Database testing** with test containers
- **API endpoint testing** with supertest
- **Authentication testing** with mock tokens
- **Real-time testing** with WebSocket clients

## 🔧 Development Assumptions

1. **Database Design**: PostgreSQL for ACID compliance and complex queries
2. **Authentication**: JWT with refresh tokens for better security
3. **Frontend**: Next.js with TypeScript for better performance
4. **UI/UX**: Tailwind CSS for customization and performance
5. **API Design**: GraphQL for flexible data fetching
6. **State Management**: Zustand for simplicity and performance
7. **Real-time**: WebSocket for instant updates
8. **Validation**: Zod for type-safe validation
9. **Testing**: Jest + Testing Library for comprehensive testing
10. **Deployment**: Docker + Kubernetes for scalability

## 📝 Notes

- The system uses multi-tenant architecture for scalability
- Venue availability is stored as individual date records for flexibility
- Booking conflicts are handled at the database level with constraints
- Focus on type safety and performance throughout the stack
- Real-time updates ensure data consistency across clients

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for the Mini Venue Booking Dashboard assignment**
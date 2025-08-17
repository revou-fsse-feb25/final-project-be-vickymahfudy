[![✨ Experience the Live Apps ✨](https://img.shields.io/badge/✨_Click_Here-To_The_Live_API_Docs!-4c51bf?style=for-the-badge&logo=vercel)](https://final-project-be-vickymahfudy-production.up.railway.app/api)

# Revou LMS - Backend API

A robust Learning Management System (LMS) backend built with NestJS, TypeScript, and PostgreSQL. This API provides comprehensive functionality for managing educational content, user authentication, assignments, and student enrollments with role-based access control.

## 🚀 Features

- **Role-Based Authentication**: JWT-based authentication with STUDENT, TEAM_LEAD, and ADMIN roles
- **Comprehensive LMS Functionality**: Complete course management with verticals, batches, modules, weeks, and lectures
- **Assignment Management**: Create, publish, and manage assignments with file/link submissions
- **Student Enrollment System**: Manage student enrollments with approval workflows
- **RESTful API Design**: Well-structured REST endpoints with comprehensive documentation
- **Database Integration**: PostgreSQL with Prisma ORM for type-safe database operations
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation
- **File Upload Support**: Handle assignment submissions with file uploads
- **Data Validation**: Comprehensive input validation using class-validator
- **Error Handling**: Structured error responses with proper HTTP status codes

## 🛠️ Tech Stack

### Core Technologies

- **Framework**: NestJS 11.0.1 (Node.js framework)
- **Language**: TypeScript 5.7.3
- **Database**: PostgreSQL with Prisma ORM 6.14.0
- **Authentication**: JWT with Passport.js
- **Documentation**: Swagger/OpenAPI 11.2.0
- **Validation**: class-validator & class-transformer
- **Password Hashing**: bcrypt
- **File Upload**: Multer

### Development Tools

- **Testing**: Jest with Supertest for E2E testing
- **Linting**: ESLint with Prettier
- **Build Tool**: NestJS CLI with SWC
- **Database Migration**: Prisma Migrate
- **Environment**: Node.js with TypeScript

## 📁 Project Architecture

```
src/
├── app.module.ts              # Root application module
├── main.ts                    # Application entry point
├── auth/                      # Authentication module
│   ├── auth.controller.ts     # Auth endpoints (login/register)
│   ├── auth.service.ts        # Authentication logic
│   ├── guards/                # Authorization guards
│   │   ├── jwt.guard.ts       # JWT authentication guard
│   │   └── admin.guard.ts     # Admin role authorization
│   └── dto/                   # Data Transfer Objects
│       ├── login.dto.ts
│       └── signup.dto.ts
├── assignment/                # Assignment management
│   ├── assignment.controller.ts
│   ├── assignment.service.ts
│   └── dto/
├── batch/                     # Batch management
│   ├── batch.controller.ts
│   ├── batch.service.ts
│   └── dto/
├── enrollment/                # Student enrollment system
│   ├── enrollment.controller.ts
│   ├── enrollment.service.ts
│   └── dto/
├── lecture/                   # Lecture management
│   ├── lecture.controller.ts
│   ├── lecture.service.ts
│   └── dto/
├── module/                    # Course module management
│   ├── module.controller.ts
│   ├── module.service.ts
│   └── dto/
├── submission/                # Assignment submissions
│   ├── submission.controller.ts
│   ├── submission.service.ts
│   └── dto/
├── vertical/                  # Vertical (program) management
│   ├── vertical.controller.ts
│   ├── vertical.service.ts
│   └── dto/
├── week/                      # Week management
│   ├── week.controller.ts
│   ├── week.service.ts
│   └── dto/
├── prisma/                    # Database service
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── common/                    # Shared utilities
│   ├── decorators/
│   └── validators/
└── config/                    # Configuration files

prisma/
├── schema.prisma              # Database schema definition
├── migrations/                # Database migration files
└── seed.ts                    # Database seeding script
```

## 🗄️ Database Schema

### Core Entities

#### User Management

- **User**: Core user entity with roles (STUDENT, TEAM_LEAD, ADMIN)
- **UserRole**: Enum defining user permission levels

#### Educational Structure

- **Vertical**: Top-level program categories (e.g., FULLSTACK)
- **Batch**: Cohorts within verticals with start/end dates
- **Module**: Course modules within batches
- **Week**: Weekly content organization within modules
- **Lecture**: Individual lecture sessions with scheduling

#### Assignment System

- **Assignment**: Assignments with types (INDIVIDUAL, GROUP, PROJECT, QUIZ, EXAM)
- **AssignmentStatus**: Status tracking (DRAFT, PUBLISHED, CLOSED, ARCHIVED)
- **Submission**: Student submissions with file/link support
- **SubmissionType**: Submission format (FILE, LINK)

#### Enrollment Management

- **Enrollment**: Student-batch relationships with approval workflow
- **EnrollmentStatus**: Status tracking (PENDING, APPROVED, REJECTED, ACTIVE, COMPLETED, DROPPED)

### Key Relationships

- Hierarchical structure: Vertical → Batch → Module → Week → Lecture
- Assignment-Batch direct relationship for flexible assignment management
- User-Enrollment-Batch many-to-many relationship
- User-Assignment-Submission tracking for submissions

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd final-project-be-vickymahfudy
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `.env` file in the root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/revou_lms?schema=public"

   # JWT Configuration
   JWT_SECRET="your-super-secret-jwt-key-here"
   JWT_EXPIRES_IN="7d"

   # Application
   PORT=3001
   NODE_ENV="development"
   ```

4. **Database Setup**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate deploy

   # Seed the database with sample data
   npm run db:seed
   ```

5. **Start the development server**

   ```bash
   npm run start:dev
   ```

   The API will be available at `http://localhost:3001`

   Swagger documentation: `http://localhost:3001/api`

## 📜 Available Scripts

| Script                | Description                              |
| --------------------- | ---------------------------------------- |
| `npm run start`       | Start the production server              |
| `npm run start:dev`   | Start development server with hot reload |
| `npm run start:debug` | Start server in debug mode               |
| `npm run start:prod`  | Start production server from dist        |
| `npm run build`       | Build the application for production     |
| `npm run lint`        | Run ESLint for code quality              |
| `npm run format`      | Format code with Prettier                |
| `npm run test`        | Run unit tests                           |
| `npm run test:watch`  | Run tests in watch mode                  |
| `npm run test:cov`    | Run tests with coverage report           |
| `npm run test:e2e`    | Run end-to-end tests                     |
| `npm run db:seed`     | Seed database with sample data           |

## 🔐 Authentication & Authorization

### Authentication Flow

1. **User Registration**: POST `/auth/register`
   - Creates new user account with hashed password
   - Returns user data and JWT access token
   - Supports all user roles (STUDENT, TEAM_LEAD, ADMIN)

2. **User Login**: POST `/auth/login`
   - Validates credentials using bcrypt
   - Returns JWT token for authenticated sessions
   - Token includes user ID, email, and role

3. **Protected Routes**:
   - JWT Guard validates tokens on protected endpoints
   - Admin Guard restricts access to admin-only operations
   - Role-based access control throughout the application

### JWT Token Structure

```json
{
  "sub": "user_id",
  "email": "user@revou.co",
  "role": "STUDENT|TEAM_LEAD|ADMIN",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Authorization Levels

- **Public**: Registration and login endpoints
- **Authenticated**: Basic user operations (profile, enrollments)
- **Admin Only**: User management, content creation, system administration

## 🌐 API Endpoints

### Authentication

- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication

### User Management

- `GET /users` - List all users (Admin)
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user (Admin)

### Educational Content

- `GET|POST /verticals` - Manage verticals
- `GET|POST /batches` - Manage batches
- `GET|POST /modules` - Manage modules
- `GET|POST /weeks` - Manage weeks
- `GET|POST /lectures` - Manage lectures

### Assignment Management

- `GET|POST /assignments` - List/create assignments
- `GET /assignments/:id` - Get assignment details
- `PATCH /assignments/:id` - Update assignment
- `PATCH /assignments/:id/publish` - Publish assignment
- `PATCH /assignments/:id/unpublish` - Unpublish assignment
- `DELETE /assignments/:id` - Delete assignment
- `GET /assignments/batch/:batchId` - Get assignments by batch
- `GET /assignments/published` - Get published assignments

### Submission Management

- `GET|POST /submissions` - List/create submissions
- `GET /submissions/:id` - Get submission details
- `PATCH /submissions/:id` - Update submission
- `DELETE /submissions/:id` - Delete submission
- `GET /submissions/assignment/:assignmentId` - Get submissions by assignment
- `GET /submissions/user/:userId` - Get user submissions

### Enrollment Management

- `GET|POST /enrollments` - List/create enrollments
- `PATCH /enrollments/:id/approve` - Approve enrollment
- `PATCH /enrollments/:id/reject` - Reject enrollment
- `GET /enrollments/user/:userId` - Get user enrollments
- `GET /enrollments/batch/:batchId` - Get batch enrollments

## 📊 Data Models

### User Model

```typescript
interface User {
  id: string;
  email: string;
  password: string; // hashed
  firstName: string;
  lastName: string;
  role: UserRole; // STUDENT | TEAM_LEAD | ADMIN
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

### Assignment Model

```typescript
interface Assignment {
  id: string;
  title: string;
  description?: string;
  type: AssignmentType; // INDIVIDUAL | GROUP | PROJECT | QUIZ | EXAM
  status: AssignmentStatus; // DRAFT | PUBLISHED | CLOSED | ARCHIVED
  maxScore?: number;
  dueDate?: DateTime;
  publishedAt?: DateTime;
  batchId: string;
  isActive: boolean;
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

### Enrollment Model

```typescript
interface Enrollment {
  id: string;
  userId: string;
  batchId: string;
  status: EnrollmentStatus; // PENDING | APPROVED | REJECTED | ACTIVE | COMPLETED | DROPPED
  enrolledAt: DateTime;
  approvedAt?: DateTime;
  completedAt?: DateTime;
  isActive: boolean;
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

## 🔧 Configuration

### Environment Variables

| Variable         | Description                  | Default       | Required |
| ---------------- | ---------------------------- | ------------- | -------- |
| `DATABASE_URL`   | PostgreSQL connection string | -             | ✅       |
| `JWT_SECRET`     | Secret key for JWT signing   | -             | ✅       |
| `JWT_EXPIRES_IN` | JWT token expiration time    | `7d`          | ❌       |
| `PORT`           | Server port number           | `3001`        | ❌       |
| `NODE_ENV`       | Environment mode             | `development` | ❌       |

### CORS Configuration

The application is configured to accept requests from:

- `http://localhost:3002` (Development frontend)
- `http://127.0.0.1:3002` (Alternative localhost)
- Production frontend URL (Railway deployment)

### Swagger Configuration

- **URL**: `/api`
- **Authentication**: Bearer token support
- **Features**: Interactive API testing, comprehensive documentation
- **Persistence**: Authorization tokens persist across browser sessions

## 🧪 Testing

### Unit Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:cov
```

### End-to-End Testing

```bash
# Run E2E tests
npm run test:e2e
```

### Test Structure

- **Unit Tests**: Service and controller testing with mocked dependencies
- **Integration Tests**: Database integration testing with test database
- **E2E Tests**: Full application flow testing with Supertest

## 🚀 Deployment

### Live API

The API is deployed on **Railway**, a modern cloud platform that provides seamless deployment with automatic CI/CD integration from GitHub.

### Production Build

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Set production environment variables**

   ```env
   NODE_ENV=production
   DATABASE_URL=postgresql://prod_user:prod_pass@prod_host:5432/prod_db
   JWT_SECRET=your-production-jwt-secret
   PORT=3001
   ```

3. **Run database migrations**

   ```bash
   npx prisma migrate deploy
   ```

4. **Start production server**
   ```bash
   npm run start:prod
   ```

### Railway Deployment (Current Platform)

**Railway** is our chosen deployment platform, offering:

- **Automatic Deployments**: Deploys automatically on every push to main branch
- **Integrated PostgreSQL**: Built-in database service with automatic backups
- **Environment Management**: Secure environment variable management
- **Custom Domains**: Automatic HTTPS and custom domain support
- **Monitoring**: Built-in application monitoring and logging

#### Deployment Steps:

1. **Connect Repository**: Link your GitHub repository to Railway
2. **Environment Variables**: Set all required environment variables in Railway dashboard:
   ```env
   DATABASE_URL=postgresql://railway_provided_url
   JWT_SECRET=your-production-jwt-secret
   NODE_ENV=production
   PORT=3001
   ```
3. **Database Setup**: Use Railway PostgreSQL addon for managed database
4. **Build Configuration**:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start:prod`
   - **Node Version**: 18+
5. **Database Migration**: Railway automatically runs migrations during deployment

#### Railway Features Used:

- **PostgreSQL Addon**: Managed database with automatic backups
- **Environment Variables**: Secure configuration management
- **Custom Domains**: Production-ready HTTPS endpoints
- **Monitoring**: Application performance and error tracking

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
```

### Database Migration in Production

```bash
# Deploy pending migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Optional: Seed production data
npm run db:seed
```

## 🔍 Error Handling

### HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication required)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **409**: Conflict (duplicate resources)
- **500**: Internal Server Error

### Error Response Format

```json
{
  "message": "Error description",
  "error": "Error type",
  "statusCode": 400,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/endpoint"
}
```

### Validation Errors

```json
{
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

## 📈 Performance Considerations

### Database Optimization

- **Indexes**: Strategic indexing on frequently queried fields
- **Relations**: Efficient join queries with Prisma
- **Pagination**: Implemented for large data sets
- **Connection Pooling**: PostgreSQL connection management

### API Optimization

- **Caching**: Response caching for static data
- **Compression**: GZIP compression for responses
- **Rate Limiting**: Protection against abuse
- **Query Optimization**: Efficient database queries

## 🔧 Development Guidelines

### Code Style

- **TypeScript**: Strict type checking enabled
- **ESLint**: Consistent code formatting
- **Prettier**: Automated code formatting
- **Naming Conventions**: PascalCase for classes, camelCase for methods

### Best Practices

1. **Modular Architecture**: Feature-based module organization
2. **Dependency Injection**: NestJS DI container usage
3. **DTO Validation**: Input validation with class-validator
4. **Error Handling**: Consistent error responses
5. **Documentation**: Comprehensive Swagger documentation
6. **Testing**: Unit and integration test coverage
7. **Security**: JWT authentication and role-based authorization

### Adding New Features

1. **Create Module**: Generate new NestJS module

   ```bash
   nest generate module feature-name
   nest generate controller feature-name
   nest generate service feature-name
   ```

2. **Define DTOs**: Create validation DTOs in `dto/` folder
3. **Update Database**: Add Prisma schema changes and migrate
4. **Implement Logic**: Add business logic in service layer
5. **Add Tests**: Write unit and integration tests
6. **Document API**: Add Swagger decorators

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/new-feature`
3. **Follow coding standards**: Run linting and formatting
4. **Write tests**: Ensure test coverage for new features
5. **Update documentation**: Add/update API documentation
6. **Commit changes**: `git commit -m 'feat: add new feature'`
7. **Push to branch**: `git push origin feature/new-feature`
8. **Submit Pull Request**: Include description and testing notes

### Commit Convention

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation updates
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions or updates
- `chore:` Build process or auxiliary tool changes

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

1. **API Documentation**: Visit `/api` endpoint for interactive docs
2. **GitHub Issues**: Submit issues with detailed reproduction steps
3. **Development Team**: Contact the development team for urgent matters

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT.io](https://jwt.io/) - JWT token debugging
- [Swagger/OpenAPI](https://swagger.io/docs/) - API documentation

---

**Built with ❤️ using NestJS, TypeScript, and PostgreSQL**

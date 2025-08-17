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

## 📊 Comprehensive Data Model

![ERD](https://github.com/user-attachments/assets/15471a1f-2006-492b-8934-a86e9c57e6c9)

### Database Schema Overview

The Revou LMS uses PostgreSQL with Prisma ORM for type-safe database operations. The schema consists of 9 core tables with well-defined relationships and constraints.

### 📋 Table Schemas

#### 1. Users Table

**Table Name**: `users`

| Column    | Data Type    | Constraints      | Default   | Description                           |
| --------- | ------------ | ---------------- | --------- | ------------------------------------- |
| id        | VARCHAR(36)  | PRIMARY KEY      | cuid()    | Unique user identifier                |
| email     | VARCHAR(255) | UNIQUE, NOT NULL | -         | User email address                    |
| password  | VARCHAR(255) | NOT NULL         | -         | Bcrypt hashed password                |
| firstName | VARCHAR(100) | NOT NULL         | -         | User's first name                     |
| lastName  | VARCHAR(100) | NOT NULL         | -         | User's last name                      |
| role      | ENUM         | NOT NULL         | 'STUDENT' | User role (STUDENT, TEAM_LEAD, ADMIN) |
| createdAt | TIMESTAMP    | NOT NULL         | NOW()     | Record creation timestamp             |
| updatedAt | TIMESTAMP    | NOT NULL         | NOW()     | Last update timestamp                 |

**Indexes**:

- `idx_user_email` (email)
- `idx_user_role` (role)

**Example Data**:

```json
{
  "id": "cm123abc456def789",
  "email": "john.doe@revou.co",
  "password": "$2b$10$...",
  "firstName": "John",
  "lastName": "Doe",
  "role": "STUDENT",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### 2. Verticals Table

**Table Name**: `verticals`

| Column      | Data Type    | Constraints      | Default | Description                           |
| ----------- | ------------ | ---------------- | ------- | ------------------------------------- |
| id          | VARCHAR(36)  | PRIMARY KEY      | cuid()  | Unique vertical identifier            |
| name        | VARCHAR(100) | UNIQUE, NOT NULL | -       | Vertical name                         |
| description | TEXT         | -                | NULL    | Detailed description                  |
| type        | ENUM         | NOT NULL         | -       | Vertical type (FULLSTACK, DATA, etc.) |
| isActive    | BOOLEAN      | NOT NULL         | true    | Active status flag                    |
| createdAt   | TIMESTAMP    | NOT NULL         | NOW()   | Record creation timestamp             |
| updatedAt   | TIMESTAMP    | NOT NULL         | NOW()   | Last update timestamp                 |

**Indexes**:

- `idx_vertical_name` (name)
- `idx_vertical_active` (isActive)

**Example Data**:

```json
{
  "id": "cm456def789ghi012",
  "name": "Full Stack Development",
  "description": "Comprehensive web development program",
  "type": "FULLSTACK",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### 3. Batches Table

**Table Name**: `batches`

| Column      | Data Type    | Constraints           | Default | Description               |
| ----------- | ------------ | --------------------- | ------- | ------------------------- |
| id          | VARCHAR(36)  | PRIMARY KEY           | cuid()  | Unique batch identifier   |
| name        | VARCHAR(100) | NOT NULL              | -       | Batch name                |
| description | TEXT         | -                     | NULL    | Batch description         |
| startDate   | DATE         | NOT NULL              | -       | Batch start date          |
| endDate     | DATE         | NOT NULL              | -       | Batch end date            |
| verticalId  | VARCHAR(36)  | FOREIGN KEY, NOT NULL | -       | Reference to vertical     |
| isActive    | BOOLEAN      | NOT NULL              | true    | Active status flag        |
| createdAt   | TIMESTAMP    | NOT NULL              | NOW()   | Record creation timestamp |
| updatedAt   | TIMESTAMP    | NOT NULL              | NOW()   | Last update timestamp     |

**Foreign Keys**:

- `verticalId` → `verticals(id)` ON DELETE CASCADE

**Indexes**:

- `idx_batch_vertical` (verticalId)
- `idx_batch_dates` (startDate, endDate)
- `idx_batch_active` (isActive)

**Example Data**:

```json
{
  "id": "cm789ghi012jkl345",
  "name": "FSSE Batch 15",
  "description": "Full Stack Software Engineering Batch 15",
  "startDate": "2024-02-01",
  "endDate": "2024-08-01",
  "verticalId": "cm456def789ghi012",
  "isActive": true,
  "createdAt": "2024-01-15T00:00:00Z",
  "updatedAt": "2024-01-15T00:00:00Z"
}
```

#### 4. Modules Table

**Table Name**: `modules`

| Column      | Data Type    | Constraints           | Default | Description                |
| ----------- | ------------ | --------------------- | ------- | -------------------------- |
| id          | VARCHAR(36)  | PRIMARY KEY           | cuid()  | Unique module identifier   |
| name        | VARCHAR(100) | NOT NULL              | -       | Module name                |
| description | TEXT         | -                     | NULL    | Module description         |
| orderIndex  | INTEGER      | NOT NULL              | -       | Display order within batch |
| batchId     | VARCHAR(36)  | FOREIGN KEY, NOT NULL | -       | Reference to batch         |
| isActive    | BOOLEAN      | NOT NULL              | true    | Active status flag         |
| createdAt   | TIMESTAMP    | NOT NULL              | NOW()   | Record creation timestamp  |
| updatedAt   | TIMESTAMP    | NOT NULL              | NOW()   | Last update timestamp      |

**Foreign Keys**:

- `batchId` → `batches(id)` ON DELETE CASCADE

**Unique Constraints**:

- `unique_module_order` (batchId, orderIndex)

**Indexes**:

- `idx_module_batch` (batchId)
- `idx_module_order` (batchId, orderIndex)
- `idx_module_active` (isActive)

**Example Data**:

```json
{
  "id": "cm012jkl345mno678",
  "name": "Frontend Fundamentals",
  "description": "HTML, CSS, and JavaScript basics",
  "orderIndex": 1,
  "batchId": "cm789ghi012jkl345",
  "isActive": true,
  "createdAt": "2024-01-20T00:00:00Z",
  "updatedAt": "2024-01-20T00:00:00Z"
}
```

#### 5. Weeks Table

**Table Name**: `weeks`

| Column      | Data Type    | Constraints           | Default | Description                 |
| ----------- | ------------ | --------------------- | ------- | --------------------------- |
| id          | VARCHAR(36)  | PRIMARY KEY           | cuid()  | Unique week identifier      |
| name        | VARCHAR(100) | NOT NULL              | -       | Week name                   |
| description | TEXT         | -                     | NULL    | Week description            |
| orderIndex  | INTEGER      | NOT NULL              | -       | Display order within module |
| startDate   | DATE         | NOT NULL              | -       | Week start date             |
| endDate     | DATE         | NOT NULL              | -       | Week end date               |
| moduleId    | VARCHAR(36)  | FOREIGN KEY, NOT NULL | -       | Reference to module         |
| isActive    | BOOLEAN      | NOT NULL              | true    | Active status flag          |
| createdAt   | TIMESTAMP    | NOT NULL              | NOW()   | Record creation timestamp   |
| updatedAt   | TIMESTAMP    | NOT NULL              | NOW()   | Last update timestamp       |

**Foreign Keys**:

- `moduleId` → `modules(id)` ON DELETE CASCADE

**Unique Constraints**:

- `unique_week_order` (moduleId, orderIndex)

**Indexes**:

- `idx_week_module` (moduleId)
- `idx_week_dates` (startDate, endDate)
- `idx_week_active` (isActive)

**Example Data**:

```json
{
  "id": "cm345mno678pqr901",
  "name": "Week 1: HTML & CSS",
  "description": "Introduction to HTML structure and CSS styling",
  "orderIndex": 1,
  "startDate": "2024-02-01",
  "endDate": "2024-02-07",
  "moduleId": "cm012jkl345mno678",
  "isActive": true,
  "createdAt": "2024-01-25T00:00:00Z",
  "updatedAt": "2024-01-25T00:00:00Z"
}
```

#### 6. Lectures Table

**Table Name**: `lectures`

| Column      | Data Type    | Constraints           | Default | Description               |
| ----------- | ------------ | --------------------- | ------- | ------------------------- |
| id          | VARCHAR(36)  | PRIMARY KEY           | cuid()  | Unique lecture identifier |
| title       | VARCHAR(200) | NOT NULL              | -       | Lecture title             |
| description | TEXT         | -                     | NULL    | Lecture description       |
| content     | TEXT         | -                     | NULL    | Lecture content/materials |
| orderIndex  | INTEGER      | NOT NULL              | -       | Display order within week |
| scheduledAt | TIMESTAMP    | -                     | NULL    | Scheduled lecture time    |
| weekId      | VARCHAR(36)  | FOREIGN KEY, NOT NULL | -       | Reference to week         |
| isActive    | BOOLEAN      | NOT NULL              | true    | Active status flag        |
| createdAt   | TIMESTAMP    | NOT NULL              | NOW()   | Record creation timestamp |
| updatedAt   | TIMESTAMP    | NOT NULL              | NOW()   | Last update timestamp     |

**Foreign Keys**:

- `weekId` → `weeks(id)` ON DELETE CASCADE

**Unique Constraints**:

- `unique_lecture_order` (weekId, orderIndex)

**Indexes**:

- `idx_lecture_week` (weekId)
- `idx_lecture_scheduled` (scheduledAt)
- `idx_lecture_active` (isActive)

**Example Data**:

```json
{
  "id": "cm678pqr901stu234",
  "title": "HTML Semantic Elements",
  "description": "Understanding semantic HTML5 elements",
  "content": "Lecture materials and examples...",
  "orderIndex": 1,
  "scheduledAt": "2024-02-01T09:00:00Z",
  "weekId": "cm345mno678pqr901",
  "isActive": true,
  "createdAt": "2024-01-30T00:00:00Z",
  "updatedAt": "2024-01-30T00:00:00Z"
}
```

#### 7. Assignments Table

**Table Name**: `assignments`

| Column      | Data Type    | Constraints           | Default | Description                                              |
| ----------- | ------------ | --------------------- | ------- | -------------------------------------------------------- |
| id          | VARCHAR(36)  | PRIMARY KEY           | cuid()  | Unique assignment identifier                             |
| title       | VARCHAR(200) | NOT NULL              | -       | Assignment title                                         |
| description | TEXT         | -                     | NULL    | Assignment description                                   |
| type        | ENUM         | NOT NULL              | -       | Assignment type (INDIVIDUAL, GROUP, PROJECT, QUIZ, EXAM) |
| status      | ENUM         | NOT NULL              | 'DRAFT' | Assignment status (DRAFT, PUBLISHED, CLOSED, ARCHIVED)   |
| maxScore    | INTEGER      | -                     | NULL    | Maximum possible score                                   |
| dueDate     | TIMESTAMP    | -                     | NULL    | Assignment due date                                      |
| publishedAt | TIMESTAMP    | -                     | NULL    | Publication timestamp                                    |
| batchId     | VARCHAR(36)  | FOREIGN KEY, NOT NULL | -       | Reference to batch                                       |
| isActive    | BOOLEAN      | NOT NULL              | true    | Active status flag                                       |
| createdAt   | TIMESTAMP    | NOT NULL              | NOW()   | Record creation timestamp                                |
| updatedAt   | TIMESTAMP    | NOT NULL              | NOW()   | Last update timestamp                                    |

**Foreign Keys**:

- `batchId` → `batches(id)` ON DELETE CASCADE

**Indexes**:

- `idx_assignment_batch` (batchId)
- `idx_assignment_status` (status)
- `idx_assignment_due` (dueDate)
- `idx_assignment_active` (isActive)

**Example Data**:

```json
{
  "id": "cm901stu234vwx567",
  "title": "Personal Portfolio Website",
  "description": "Create a responsive portfolio website using HTML and CSS",
  "type": "PROJECT",
  "status": "PUBLISHED",
  "maxScore": 100,
  "dueDate": "2024-02-14T23:59:59Z",
  "publishedAt": "2024-02-01T10:00:00Z",
  "batchId": "cm789ghi012jkl345",
  "isActive": true,
  "createdAt": "2024-01-28T00:00:00Z",
  "updatedAt": "2024-02-01T10:00:00Z"
}
```

#### 8. Submissions Table

**Table Name**: `submissions`

| Column       | Data Type    | Constraints           | Default | Description                  |
| ------------ | ------------ | --------------------- | ------- | ---------------------------- |
| id           | VARCHAR(36)  | PRIMARY KEY           | cuid()  | Unique submission identifier |
| content      | TEXT         | -                     | NULL    | Submission content/notes     |
| fileUrl      | VARCHAR(500) | -                     | NULL    | Uploaded file URL            |
| linkUrl      | VARCHAR(500) | -                     | NULL    | External link URL            |
| type         | ENUM         | NOT NULL              | -       | Submission type (FILE, LINK) |
| score        | INTEGER      | -                     | NULL    | Assigned score               |
| feedback     | TEXT         | -                     | NULL    | Instructor feedback          |
| submittedAt  | TIMESTAMP    | NOT NULL              | NOW()   | Submission timestamp         |
| gradedAt     | TIMESTAMP    | -                     | NULL    | Grading timestamp            |
| assignmentId | VARCHAR(36)  | FOREIGN KEY, NOT NULL | -       | Reference to assignment      |
| userId       | VARCHAR(36)  | FOREIGN KEY, NOT NULL | -       | Reference to user            |
| isActive     | BOOLEAN      | NOT NULL              | true    | Active status flag           |
| createdAt    | TIMESTAMP    | NOT NULL              | NOW()   | Record creation timestamp    |
| updatedAt    | TIMESTAMP    | NOT NULL              | NOW()   | Last update timestamp        |

**Foreign Keys**:

- `assignmentId` → `assignments(id)` ON DELETE CASCADE
- `userId` → `users(id)` ON DELETE CASCADE

**Unique Constraints**:

- `unique_user_assignment` (userId, assignmentId)

**Indexes**:

- `idx_submission_assignment` (assignmentId)
- `idx_submission_user` (userId)
- `idx_submission_submitted` (submittedAt)
- `idx_submission_active` (isActive)

**Example Data**:

```json
{
  "id": "cm234vwx567yza890",
  "content": "My portfolio website showcasing HTML and CSS skills",
  "fileUrl": null,
  "linkUrl": "https://johndoe-portfolio.netlify.app",
  "type": "LINK",
  "score": 85,
  "feedback": "Great work! Clean design and responsive layout.",
  "submittedAt": "2024-02-13T20:30:00Z",
  "gradedAt": "2024-02-15T14:00:00Z",
  "assignmentId": "cm901stu234vwx567",
  "userId": "cm123abc456def789",
  "isActive": true,
  "createdAt": "2024-02-13T20:30:00Z",
  "updatedAt": "2024-02-15T14:00:00Z"
}
```

#### 9. Enrollments Table

**Table Name**: `enrollments`

| Column      | Data Type   | Constraints           | Default   | Description                                                                 |
| ----------- | ----------- | --------------------- | --------- | --------------------------------------------------------------------------- |
| id          | VARCHAR(36) | PRIMARY KEY           | cuid()    | Unique enrollment identifier                                                |
| userId      | VARCHAR(36) | FOREIGN KEY, NOT NULL | -         | Reference to user                                                           |
| batchId     | VARCHAR(36) | FOREIGN KEY, NOT NULL | -         | Reference to batch                                                          |
| status      | ENUM        | NOT NULL              | 'PENDING' | Enrollment status (PENDING, APPROVED, REJECTED, ACTIVE, COMPLETED, DROPPED) |
| enrolledAt  | TIMESTAMP   | NOT NULL              | NOW()     | Enrollment request timestamp                                                |
| approvedAt  | TIMESTAMP   | -                     | NULL      | Approval timestamp                                                          |
| completedAt | TIMESTAMP   | -                     | NULL      | Completion timestamp                                                        |
| isActive    | BOOLEAN     | NOT NULL              | true      | Active status flag                                                          |
| createdAt   | TIMESTAMP   | NOT NULL              | NOW()     | Record creation timestamp                                                   |
| updatedAt   | TIMESTAMP   | NOT NULL              | NOW()     | Last update timestamp                                                       |

**Foreign Keys**:

- `userId` → `users(id)` ON DELETE CASCADE
- `batchId` → `batches(id)` ON DELETE CASCADE

**Unique Constraints**:

- `unique_user_batch` (userId, batchId)

**Indexes**:

- `idx_enrollment_user` (userId)
- `idx_enrollment_batch` (batchId)
- `idx_enrollment_status` (status)
- `idx_enrollment_active` (isActive)

**Example Data**:

```json
{
  "id": "cm567yza890bcd123",
  "userId": "cm123abc456def789",
  "batchId": "cm789ghi012jkl345",
  "status": "APPROVED",
  "enrolledAt": "2024-01-20T15:30:00Z",
  "approvedAt": "2024-01-22T09:00:00Z",
  "completedAt": null,
  "isActive": true,
  "createdAt": "2024-01-20T15:30:00Z",
  "updatedAt": "2024-01-22T09:00:00Z"
}
```

### 🔗 Entity Relationships

#### Hierarchical Structure

```
Vertical (1) ──→ (∞) Batch (1) ──→ (∞) Module (1) ──→ (∞) Week (1) ──→ (∞) Lecture
```

#### Assignment & Submission Flow

```
Batch (1) ──→ (∞) Assignment (1) ──→ (∞) Submission (∞) ←── (1) User
```

#### Enrollment System

```
User (∞) ←──→ (∞) Enrollment (∞) ←──→ (1) Batch
```

#### Detailed Relationship Definitions

1. **Vertical → Batch** (One-to-Many)
   - One vertical can have multiple batches
   - Each batch belongs to exactly one vertical
   - CASCADE DELETE: Deleting a vertical removes all its batches

2. **Batch → Module** (One-to-Many)
   - One batch can have multiple modules
   - Each module belongs to exactly one batch
   - CASCADE DELETE: Deleting a batch removes all its modules

3. **Module → Week** (One-to-Many)
   - One module can have multiple weeks
   - Each week belongs to exactly one module
   - CASCADE DELETE: Deleting a module removes all its weeks

4. **Week → Lecture** (One-to-Many)
   - One week can have multiple lectures
   - Each lecture belongs to exactly one week
   - CASCADE DELETE: Deleting a week removes all its lectures

5. **Batch → Assignment** (One-to-Many)
   - One batch can have multiple assignments
   - Each assignment belongs to exactly one batch
   - CASCADE DELETE: Deleting a batch removes all its assignments

6. **Assignment → Submission** (One-to-Many)
   - One assignment can have multiple submissions
   - Each submission belongs to exactly one assignment
   - CASCADE DELETE: Deleting an assignment removes all its submissions

7. **User → Submission** (One-to-Many)
   - One user can have multiple submissions
   - Each submission belongs to exactly one user
   - CASCADE DELETE: Deleting a user removes all their submissions

8. **User ↔ Batch** (Many-to-Many via Enrollment)
   - Users can enroll in multiple batches
   - Batches can have multiple enrolled users
   - Managed through the enrollments table
   - CASCADE DELETE: Deleting a user or batch removes related enrollments

### 📖 Data Dictionary

#### Enum Definitions

**UserRole**

- `STUDENT`: Regular student with basic access
- `TEAM_LEAD`: Student with additional mentoring responsibilities
- `ADMIN`: Full system access for content management

**VerticalType**

- `FULLSTACK`: Full-stack web development program
- `DATA`: Data science and analytics program
- `PRODUCT`: Product management program
- `DESIGN`: UI/UX design program

**AssignmentType**

- `INDIVIDUAL`: Solo assignment for individual assessment
- `GROUP`: Collaborative assignment for team skills
- `PROJECT`: Comprehensive project-based assessment
- `QUIZ`: Short knowledge assessment
- `EXAM`: Formal examination

**AssignmentStatus**

- `DRAFT`: Assignment being prepared, not visible to students
- `PUBLISHED`: Active assignment available to students
- `CLOSED`: Assignment past due date, no new submissions
- `ARCHIVED`: Historical assignment, read-only

**SubmissionType**

- `FILE`: File upload submission (documents, images, etc.)
- `LINK`: URL-based submission (GitHub repos, deployed sites, etc.)

**EnrollmentStatus**

- `PENDING`: Enrollment request awaiting approval
- `APPROVED`: Enrollment approved, student can access content
- `REJECTED`: Enrollment request denied
- `ACTIVE`: Currently enrolled and participating
- `COMPLETED`: Successfully completed the batch
- `DROPPED`: Voluntarily or involuntarily left the batch

#### Business Rules

1. **User Management**
   - Email addresses must be unique across all users
   - Passwords are hashed using bcrypt with salt rounds
   - Only ADMIN users can create/modify other users

2. **Educational Hierarchy**
   - Order indexes must be unique within their parent scope
   - Dates must be logical (start < end, no overlaps)
   - Soft deletion using isActive flag preserves data integrity

3. **Assignment System**
   - Only PUBLISHED assignments accept submissions
   - Students can only submit once per assignment
   - Scores cannot exceed maxScore when set
   - Due dates are enforced at the application level

4. **Enrollment Workflow**
   - Students can only enroll in ACTIVE batches
   - ADMIN approval required for enrollment activation
   - Enrollment status transitions follow defined workflow

5. **Data Integrity**
   - All foreign key relationships enforce referential integrity
   - Cascade deletes maintain consistency
   - Unique constraints prevent duplicate data
   - Timestamps track all data changes

### 🎯 Performance Optimizations

#### Database Indexes

1. **Query Performance**
   - Email lookups: `idx_user_email`
   - Role-based filtering: `idx_user_role`
   - Hierarchical navigation: `idx_batch_vertical`, `idx_module_batch`
   - Date range queries: `idx_batch_dates`, `idx_week_dates`

2. **Composite Indexes**
   - Ordered content: `idx_module_order`, `idx_week_order`
   - Active record filtering: Combined with isActive flags
   - Assignment management: `idx_assignment_batch` + `idx_assignment_status`

3. **Foreign Key Indexes**
   - Automatic indexing on all foreign key columns
   - Optimized JOIN operations across related tables
   - Efficient cascade delete operations

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

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/new-feature`
3. **Follow coding standards**: Run linting and formatting
4. **Write tests**: Ensure test coverage for new features
5. **Update documentation**: Add/update API documentation
6. **Commit changes**: `git commit -m 'feat: add new feature'`
7. **Push to branch**: `git push origin feature/new-feature`
8. **Submit Pull Request**: Include description and testing notes

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ using NestJS, TypeScript, and PostgreSQL**

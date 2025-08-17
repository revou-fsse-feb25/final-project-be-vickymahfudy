# Authentication Guards Documentation

This document provides comprehensive information about the authentication and authorization guards used in the application.

## Overview

The application uses a layered security approach with multiple guards that can be combined to provide fine-grained access control:

1. **JwtGuard** - Base authentication guard
2. **AdminGuard** - Admin role authorization
3. **StudentGuard** - Student role authorization
4. **EnrollmentGuard** - Batch enrollment verification

## Guard Hierarchy

```
JwtGuard (Base Authentication)
├── AdminGuard (extends JwtGuard)
├── StudentGuard (extends JwtGuard)
└── EnrollmentGuard (standalone, requires JWT context)
```

## Guard Details

### 1. JwtGuard

**Purpose**: Validates JWT tokens and ensures users are authenticated.

**Location**: `src/auth/guards/jwt.guard.ts`

**Functionality**:
- Extracts Bearer token from Authorization header
- Verifies token signature and expiration
- Attaches user information to request object

**Usage**:
```typescript
@UseGuards(JwtGuard)
@Get('profile')
getProfile(@Request() req) {
  return req.user; // Contains: { sub, email, role, iat, exp }
}
```

**Throws**:
- `UnauthorizedException`: When token is missing, invalid, or expired

### 2. AdminGuard

**Purpose**: Restricts access to admin-only endpoints.

**Location**: `src/auth/guards/admin.guard.ts`

**Functionality**:
- Extends JwtGuard (inherits authentication)
- Verifies user role is 'ADMIN'
- Provides admin-only access control

**Usage**:
```typescript
@UseGuards(JwtGuard, AdminGuard)
@Post('users')
createUser(@Body() userData: CreateUserDto) {
  // Only admins can create users
}
```

**Throws**:
- `UnauthorizedException`: When JWT token is invalid (inherited)
- `ForbiddenException`: When user role is not ADMIN

### 3. StudentGuard

**Purpose**: Restricts access to student-only endpoints.

**Location**: `src/auth/guards/student.guard.ts`

**Functionality**:
- Extends JwtGuard (inherits authentication)
- Verifies user role is 'STUDENT'
- Provides student-only access control

**Usage**:
```typescript
@UseGuards(JwtGuard, StudentGuard)
@Post('enrollments')
enrollInBatch(@Body() enrollmentData: CreateEnrollmentDto) {
  // Only students can enroll in batches
}
```

**Throws**:
- `UnauthorizedException`: When JWT token is invalid (inherited)
- `ForbiddenException`: When user role is not STUDENT

### 4. EnrollmentGuard

**Purpose**: Verifies user enrollment in specific batches.

**Location**: `src/auth/guards/enrollment.guard.ts`

**Functionality**:
- Checks if user is enrolled in the requested batch
- Validates batch access permissions
- Requires batchId parameter in request

**Usage**:
```typescript
@UseGuards(JwtGuard, EnrollmentGuard)
@Get('batch/:batchId/content')
getBatchContent(@Param('batchId') batchId: string) {
  // Only enrolled students can access batch content
}
```

**Throws**:
- `ForbiddenException`: When user is not authenticated or not enrolled
- `BadRequestException`: When batchId parameter is missing

## Common Usage Patterns

### 1. Public Endpoints
```typescript
// No guards - accessible to everyone
@Post('auth/login')
login(@Body() loginDto: LoginDto) {
  return this.authService.login(loginDto);
}
```

### 2. Authenticated Endpoints
```typescript
// Requires valid JWT token
@UseGuards(JwtGuard)
@Get('profile')
getProfile(@Request() req) {
  return this.userService.getProfile(req.user.sub);
}
```

### 3. Role-Based Access
```typescript
// Admin only
@UseGuards(JwtGuard, AdminGuard)
@Delete('users/:id')
deleteUser(@Param('id') id: string) {
  return this.userService.deleteUser(id);
}

// Student only
@UseGuards(JwtGuard, StudentGuard)
@Get('my-enrollments')
getMyEnrollments(@Request() req) {
  return this.enrollmentService.getStudentEnrollments(req.user.sub);
}
```

### 4. Enrollment-Based Access
```typescript
// Requires enrollment in specific batch
@UseGuards(JwtGuard, StudentGuard, EnrollmentGuard)
@Get('batch/:batchId/lectures')
getBatchLectures(@Param('batchId') batchId: string) {
  return this.lectureService.getLecturesByBatch(batchId);
}
```

## JWT Token Structure

The JWT payload contains the following information:

```typescript
interface JwtPayload {
  sub: string;      // User ID
  email: string;    // User email
  role: string;     // User role (ADMIN, STUDENT, TEAM_LEAD)
  iat?: number;     // Issued at timestamp
  exp?: number;     // Expiration timestamp
}
```

## Error Handling

### Authentication Errors
- **401 Unauthorized**: Invalid or missing JWT token
- **401 Unauthorized**: Expired JWT token

### Authorization Errors
- **403 Forbidden**: Insufficient role permissions
- **403 Forbidden**: Not enrolled in required batch

### Validation Errors
- **400 Bad Request**: Missing required parameters (e.g., batchId)

## Security Best Practices

1. **Always use JwtGuard first** when combining guards
2. **Use specific role guards** (AdminGuard, StudentGuard) for role-based access
3. **Combine guards appropriately** for layered security
4. **Validate enrollment** for batch-specific content
5. **Handle errors gracefully** with appropriate HTTP status codes

## Guard Combination Examples

```typescript
// Authentication only
@UseGuards(JwtGuard)

// Admin access
@UseGuards(JwtGuard, AdminGuard)

// Student access
@UseGuards(JwtGuard, StudentGuard)

// Student with enrollment verification
@UseGuards(JwtGuard, StudentGuard, EnrollmentGuard)

// Multiple guards for complex scenarios
@UseGuards(JwtGuard, AdminGuard, CustomGuard)
```

## Testing Guards

When testing endpoints with guards:

1. **Include valid JWT token** in Authorization header
2. **Use appropriate user role** for role-based guards
3. **Ensure enrollment exists** for EnrollmentGuard
4. **Test error scenarios** (invalid tokens, wrong roles, etc.)

Example test setup:
```typescript
const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
const headers = { Authorization: token };

// Test authenticated endpoint
await request(app.getHttpServer())
  .get('/profile')
  .set(headers)
  .expect(200);
```
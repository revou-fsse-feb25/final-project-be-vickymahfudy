# Error Handling Documentation

## Overview

The Revou LMS API implements a standardized error handling system that provides consistent error responses across all endpoints. This documentation outlines the error response format, common HTTP status codes, and error handling patterns used throughout the application.

## Error Response Format

All API errors follow a consistent JSON response structure:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/users"
}
```

### Response Fields

- **statusCode**: HTTP status code (number)
- **error**: Human-readable error type (string)
- **message**: Detailed error description (string or array of strings for validation errors)
- **timestamp**: ISO 8601 timestamp when the error occurred
- **path**: API endpoint where the error occurred

## HTTP Status Codes

### 400 - Bad Request
Returned when the request is malformed or contains invalid data.

**Common scenarios:**
- Invalid request body format
- Missing required fields
- Invalid data types
- Business logic validation failures

**Example:**
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Invalid email format",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/auth/register"
}
```

### 401 - Unauthorized
Returned when authentication is required but not provided or invalid.

**Common scenarios:**
- Missing JWT token
- Invalid or expired JWT token
- Malformed Authorization header

**Example:**
```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Invalid or expired token",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/batches"
}
```

### 403 - Forbidden
Returned when the user is authenticated but lacks permission for the requested resource.

**Common scenarios:**
- Student trying to access admin-only endpoints
- User not enrolled in the required batch
- Insufficient role permissions

**Example:**
```json
{
  "statusCode": 403,
  "error": "Forbidden",
  "message": "Admin access required",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/admin/users"
}
```

### 404 - Not Found
Returned when the requested resource does not exist.

**Common scenarios:**
- Invalid resource ID
- Resource has been deleted
- Incorrect endpoint URL

**Example:**
```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Batch not found",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/batches/999"
}
```

### 409 - Conflict
Returned when the request conflicts with the current state of the resource.

**Common scenarios:**
- Duplicate email registration
- Unique constraint violations
- Resource already exists

**Example:**
```json
{
  "statusCode": 409,
  "error": "Conflict",
  "message": "Email already exists",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/auth/register"
}
```

### 422 - Unprocessable Entity
Returned when the request is well-formed but contains semantic errors.

**Common scenarios:**
- Business rule violations
- Invalid state transitions
- Complex validation failures

**Example:**
```json
{
  "statusCode": 422,
  "error": "Unprocessable Entity",
  "message": "End date must be after start date",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/batches"
}
```

### 500 - Internal Server Error
Returned when an unexpected server error occurs.

**Common scenarios:**
- Database connection failures
- Unhandled exceptions
- Third-party service failures

**Example:**
```json
{
  "statusCode": 500,
  "error": "Internal Server Error",
  "message": "Internal server error",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/submissions"
}
```

## Validation Errors

For validation errors with multiple issues, the `message` field contains an array of specific validation messages:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": [
    "email must be a valid email",
    "password must be at least 8 characters long",
    "name should not be empty"
  ],
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/auth/register"
}
```

## Error Handling Implementation

### Global Exception Filter

The application uses a global exception filter (`HttpExceptionFilter`) that:

1. **Catches all exceptions** thrown throughout the application
2. **Formats responses consistently** using the standard error structure
3. **Logs errors appropriately** for monitoring and debugging
4. **Handles different exception types** (HTTP exceptions, validation errors, etc.)

### Controller-Level Error Documentation

Each controller endpoint is documented with appropriate Swagger decorators:

```typescript
@ApiResponse({ status: 200, description: 'Success' })
@ApiBadRequestResponse({ description: 'Invalid input data' })
@ApiUnauthorizedResponse({ description: 'Authentication required' })
@ApiForbiddenResponse({ description: 'Insufficient permissions' })
@ApiNotFoundResponse({ description: 'Resource not found' })
```

### Service-Level Error Throwing

Services throw specific HTTP exceptions for different error scenarios:

```typescript
// Not found errors
throw new NotFoundException('Batch not found');

// Validation errors
throw new BadRequestException('Invalid email format');

// Permission errors
throw new ForbiddenException('Admin access required');

// Conflict errors
throw new ConflictException('Email already exists');
```

## Best Practices

### For API Consumers

1. **Always check the status code** before processing the response
2. **Handle error responses gracefully** in your application
3. **Display meaningful error messages** to end users
4. **Log errors for debugging** but don't expose sensitive information
5. **Implement retry logic** for 5xx errors when appropriate

### For API Developers

1. **Use appropriate HTTP status codes** for different error scenarios
2. **Provide clear, actionable error messages** that help users understand what went wrong
3. **Include relevant context** in error messages without exposing sensitive data
4. **Document all possible error responses** in Swagger/OpenAPI specifications
5. **Log errors with sufficient detail** for debugging and monitoring

## Error Monitoring

The application logs errors at different levels:

- **4xx errors**: Logged as warnings (client errors)
- **5xx errors**: Logged as errors (server errors)
- **Unhandled exceptions**: Logged as errors with full stack traces

This logging strategy helps with:
- Debugging application issues
- Monitoring API health
- Identifying common error patterns
- Performance optimization

## Security Considerations

1. **Error messages should not expose sensitive information** such as:
   - Database schema details
   - Internal system paths
   - User data from other accounts
   - Security tokens or keys

2. **Stack traces are not included** in production error responses

3. **Detailed error information is logged server-side** for debugging while keeping client responses clean

4. **Rate limiting errors** (429) may be implemented for API protection

This standardized error handling ensures a consistent, secure, and developer-friendly API experience across all endpoints.
# API Versioning Documentation

## Overview

The Revou LMS API follows semantic versioning principles to ensure backward compatibility and smooth evolution of the API. This document outlines the current versioning strategy, deprecation policies, and guidelines for API consumers.

## Current API Version

**Version: 1.0**
- **Status**: Stable and Production-Ready
- **Release Date**: January 2024
- **Compatibility**: All endpoints are stable and backward compatible

## Versioning Strategy

### Semantic Versioning

The API follows semantic versioning (SemVer) with the format `MAJOR.MINOR.PATCH`:

- **MAJOR**: Breaking changes that require client updates
- **MINOR**: New features that are backward compatible
- **PATCH**: Bug fixes and minor improvements

### Version Communication

1. **Swagger Documentation**: Version information is prominently displayed in the API documentation
2. **Response Headers**: API version is included in response headers
3. **Changelog**: Detailed version history is maintained in the project repository

## Current API Endpoints (v1.0)

All endpoints are currently stable and production-ready:

### Authentication & Authorization
- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration

### Educational Structure
- `GET /verticals` - List all educational verticals
- `GET /batches` - List all student batches
- `GET /modules` - List all course modules
- `GET /weeks` - List all weekly content
- `GET /lectures` - List all lecture sessions

### Learning & Assessment
- `GET /assignments` - List all assignments
- `POST /submissions` - Submit assignment solutions
- `GET /enrollments` - Manage student enrollments

### Administrative Operations
- All CRUD operations for educational content management
- User management and role-based access control

## Backward Compatibility Guarantee

### What We Guarantee

1. **Endpoint URLs**: Existing endpoint paths will remain unchanged
2. **Request Formats**: Required request parameters and body structures will not change
3. **Response Structures**: Core response fields will remain consistent
4. **Authentication**: JWT token format and authentication flow will remain stable
5. **HTTP Status Codes**: Standard HTTP status codes will continue to be used consistently

### What May Change (Non-Breaking)

1. **Additional Fields**: New optional fields may be added to responses
2. **New Endpoints**: New API endpoints may be introduced
3. **Enhanced Validation**: More detailed validation messages may be added
4. **Performance Improvements**: Internal optimizations that don't affect the API contract

## Future Versioning Plans

### Version 1.1 (Planned)

**Expected Release**: Q2 2024

**Planned Features**:
- Enhanced search and filtering capabilities
- Bulk operations for administrative tasks
- Advanced analytics endpoints
- Real-time notifications via WebSocket

**Backward Compatibility**: Fully backward compatible with v1.0

### Version 2.0 (Future)

**Expected Release**: Q4 2024

**Potential Breaking Changes**:
- GraphQL endpoint introduction
- Enhanced authentication with OAuth2
- Restructured response formats for better consistency
- Deprecated endpoint removal

## Deprecation Policy

### Deprecation Process

1. **Announcement**: Deprecation notices will be communicated 6 months in advance
2. **Documentation**: Deprecated endpoints will be clearly marked in Swagger documentation
3. **Headers**: Deprecation warnings will be included in API response headers
4. **Migration Guide**: Detailed migration instructions will be provided
5. **Support Period**: Deprecated endpoints will be supported for at least 12 months

### Deprecation Indicators

#### Swagger Documentation
```typescript
@ApiOperation({
  summary: 'Get user profile (DEPRECATED)',
  description: 'This endpoint is deprecated. Use GET /users/profile instead.',
  deprecated: true,
})
@ApiResponse({
  status: 200,
  description: 'User profile data',
  headers: {
    'X-API-Deprecation-Warning': {
      description: 'Deprecation warning message',
      schema: { type: 'string' },
    },
  },
})
```

#### Response Headers
```http
X-API-Deprecation-Warning: This endpoint is deprecated and will be removed in v2.0. Use GET /users/profile instead.
X-API-Deprecation-Date: 2024-06-01
X-API-Sunset-Date: 2025-01-01
```

## Client Integration Guidelines

### Version Checking

Clients should implement version checking to ensure compatibility:

```typescript
// Example: Check API version compatibility
const checkApiCompatibility = async () => {
  const response = await fetch('/api');
  const apiVersion = response.headers.get('X-API-Version');
  
  if (!isCompatibleVersion(apiVersion, '1.0')) {
    console.warn('API version mismatch detected');
    // Handle version incompatibility
  }
};
```

### Error Handling for Version Issues

```typescript
// Handle version-related errors
const handleApiResponse = (response) => {
  if (response.status === 410) {
    // Endpoint has been removed
    throw new Error('API endpoint no longer available. Please update your client.');
  }
  
  const deprecationWarning = response.headers.get('X-API-Deprecation-Warning');
  if (deprecationWarning) {
    console.warn('Deprecation Warning:', deprecationWarning);
    // Log or notify about deprecated endpoint usage
  }
};
```

### Best Practices for Clients

1. **Monitor Deprecation Warnings**: Regularly check for deprecation headers in responses
2. **Subscribe to Updates**: Follow the API changelog for version announcements
3. **Test Against New Versions**: Test your application against beta versions when available
4. **Implement Graceful Degradation**: Handle API changes gracefully in your application
5. **Use Semantic Versioning**: Align your client versioning with API compatibility requirements

## Migration Support

### When Breaking Changes Occur

1. **Migration Guide**: Comprehensive documentation will be provided
2. **Code Examples**: Before/after code examples for common use cases
3. **Migration Tools**: Automated tools may be provided for complex migrations
4. **Support Channels**: Dedicated support for migration-related questions
5. **Transition Period**: Overlapping support for old and new versions

### Example Migration Guide Structure

```markdown
## Migration from v1.x to v2.0

### Breaking Changes

1. **Authentication Changes**
   - Old: `Authorization: Bearer <token>`
   - New: `Authorization: OAuth <token>`
   - Migration: Update authentication headers in all requests

2. **Response Format Changes**
   - Old: `{ data: {...}, status: 'success' }`
   - New: `{ result: {...}, meta: { status: 'success' } }`
   - Migration: Update response parsing logic

### Step-by-Step Migration

1. Update authentication implementation
2. Modify response parsing logic
3. Test all API integrations
4. Deploy and monitor
```

## Monitoring and Analytics

### Version Usage Tracking

- **Endpoint Usage**: Track which API versions are being used
- **Deprecation Metrics**: Monitor usage of deprecated endpoints
- **Client Distribution**: Understand client version distribution
- **Migration Progress**: Track adoption of new API versions

### Health Monitoring

- **Performance Metrics**: Monitor API performance across versions
- **Error Rates**: Track error rates for different API versions
- **Compatibility Issues**: Identify and resolve compatibility problems

## Contact and Support

### For API Version Questions

- **Email**: api-support@revou.co
- **Documentation**: [API Documentation](http://localhost:3001/api)
- **Changelog**: [GitHub Repository](https://github.com/revou/lms-api/blob/main/CHANGELOG.md)
- **Community**: [Developer Forum](https://forum.revou.co/api)

### Emergency Support

For critical issues related to API versioning or breaking changes:
- **Emergency Email**: emergency-api@revou.co
- **Response Time**: Within 4 hours during business hours
- **Escalation**: Direct line to the API development team

This versioning strategy ensures a stable, predictable API evolution while providing clear communication and support for all API consumers.
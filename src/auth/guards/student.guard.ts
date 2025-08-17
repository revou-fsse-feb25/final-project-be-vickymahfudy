import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtGuard } from './jwt.guard';

/**
 * JWT payload interface containing user information
 * @interface JwtPayload
 */
interface JwtPayload {
  /** User ID */
  sub: string;
  /** User email address */
  email: string;
  /** User role (ADMIN, STUDENT, TEAM_LEAD) */
  role: string;
  /** Token issued at timestamp */
  iat?: number;
  /** Token expiration timestamp */
  exp?: number;
}

/**
 * Extended Request interface with authenticated user data
 * @interface RequestWithUser
 */
interface RequestWithUser extends Request {
  /** Authenticated user information from JWT token */
  user: JwtPayload;
}

/**
 * Student Authorization Guard
 *
 * This guard extends JwtGuard to provide student-only access control.
 * It first validates JWT authentication, then checks if the user has STUDENT role.
 * Only users with STUDENT role can access endpoints protected by this guard.
 *
 * @example
 * ```typescript
 * @UseGuards(JwtGuard, StudentGuard)
 * @Post('enrollments')
 * enrollInBatch(@Body() enrollmentData: CreateEnrollmentDto) {
 *   // Only students can enroll in batches
 * }
 * ```
 *
 * @throws {UnauthorizedException} When JWT token is invalid (inherited from JwtGuard)
 * @throws {ForbiddenException} When user role is not STUDENT
 */
@Injectable()
export class StudentGuard extends JwtGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First check if user is authenticated
    const isAuthenticated = await super.canActivate(context);

    if (!isAuthenticated) {
      return false;
    }

    // Then check if user has student role
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (user.role !== 'STUDENT') {
      throw new ForbiddenException('Access denied. Student role required.');
    }

    return true;
  }
}

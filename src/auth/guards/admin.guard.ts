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
 * Admin Authorization Guard
 *
 * This guard extends JwtGuard to provide admin-only access control.
 * It first validates JWT authentication, then checks if the user has ADMIN role.
 * Only users with ADMIN role can access endpoints protected by this guard.
 *
 * @example
 * ```typescript
 * @UseGuards(JwtGuard, AdminGuard)
 * @Post('users')
 * createUser(@Body() userData: CreateUserDto) {
 *   // Only admins can create users
 * }
 * ```
 *
 * @throws {UnauthorizedException} When JWT token is invalid (inherited from JwtGuard)
 * @throws {ForbiddenException} When user role is not ADMIN
 */
@Injectable()
export class AdminGuard extends JwtGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First check if user is authenticated
    const isAuthenticated = await super.canActivate(context);

    if (!isAuthenticated) {
      return false;
    }

    // Then check if user has admin role
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied. Admin role required.');
    }

    return true;
  }
}

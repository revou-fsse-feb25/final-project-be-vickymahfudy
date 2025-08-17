import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

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
 * JWT Authentication Guard
 *
 * This guard validates JWT tokens and ensures users are authenticated.
 * It extracts the Bearer token from the Authorization header, verifies it,
 * and attaches the user information to the request object.
 *
 * @example
 * ```typescript
 * @UseGuards(JwtGuard)
 * @Get('profile')
 * getProfile(@Request() req) {
 *   return req.user; // Contains JWT payload
 * }
 * ```
 *
 * @throws {UnauthorizedException} When token is missing, invalid, or expired
 */
@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Access token is required');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET || 'your-secret-key',
      });

      // Attach user info to request object
      request.user = payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { EnrollmentService } from '../../enrollment/enrollment.service';

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
 * Enrollment Access Guard
 * 
 * This guard verifies that a user has access to specific batch content
 * by checking their enrollment status. It ensures that only enrolled
 * students can access batch-specific resources like lectures, assignments, etc.
 * 
 * Note: This guard assumes JWT authentication has already been performed
 * and user information is available in the request object.
 * 
 * @example
 * ```typescript
 * @UseGuards(JwtGuard, EnrollmentGuard)
 * @Get('batch/:batchId/content')
 * getBatchContent(@Param('batchId') batchId: string) {
 *   // Only enrolled students can access this batch content
 * }
 * ```
 * 
 * @throws {ForbiddenException} When user is not authenticated or not enrolled
 * @throws {BadRequestException} When batchId parameter is missing
 */
@Injectable()
export class EnrollmentGuard implements CanActivate {
  constructor(private enrollmentService: EnrollmentService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      user: JwtPayload;
      params: { batchId?: string };
    }>();
    const user = request.user;
    const batchId = request.params?.batchId;

    if (!user || !user.sub) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!batchId) {
      throw new BadRequestException('Batch ID is required');
    }

    // Verify that the user is enrolled in the requested batch
    const hasAccess = await this.enrollmentService.verifyEnrollmentAccess(
      user.sub,
      batchId,
    );

    if (!hasAccess) {
      throw new ForbiddenException(
        'You do not have access to this batch content. Please ensure you are enrolled in this batch.',
      );
    }

    return true;
  }
}

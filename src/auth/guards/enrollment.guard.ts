import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { EnrollmentService } from '../../enrollment/enrollment.service';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class EnrollmentGuard implements CanActivate {
  constructor(private enrollmentService: EnrollmentService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
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

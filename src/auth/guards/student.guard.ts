import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtGuard } from './jwt.guard';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

interface RequestWithUser extends Request {
  user: JwtPayload;
}

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

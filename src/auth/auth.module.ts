import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtGuard } from './guards/jwt.guard';
import { AdminGuard } from './guards/admin.guard';
import { StudentGuard } from './guards/student.guard';
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtGuard, AdminGuard, StudentGuard],
  exports: [AuthService, JwtGuard, AdminGuard, StudentGuard, JwtModule],
})
export class AuthModule {}

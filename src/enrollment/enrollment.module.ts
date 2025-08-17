import { Module } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { EnrollmentGuard } from '../auth/guards/enrollment.guard';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [EnrollmentController],
  providers: [EnrollmentService, EnrollmentGuard],
  exports: [EnrollmentService, EnrollmentGuard],
})
export class EnrollmentModule {}

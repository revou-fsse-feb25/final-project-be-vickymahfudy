import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { VerticalModule } from './vertical/vertical.module';
import { BatchModule } from './batch/batch.module';
import { ModuleModule } from './module/module.module';
import { WeekModule } from './week/week.module';
import { LectureModule } from './lecture/lecture.module';
import { AssignmentModule } from './assignment/assignment.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { SubmissionModule } from './submission/submission.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    VerticalModule,
    BatchModule,
    ModuleModule,
    WeekModule,
    LectureModule,
    AssignmentModule,
    EnrollmentModule,
    SubmissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

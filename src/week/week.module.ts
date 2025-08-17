import { Module } from '@nestjs/common';
import { WeekService } from './week.service';
import { WeekController } from './week.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [WeekController],
  providers: [WeekService],
  exports: [WeekService],
})
export class WeekModule {}
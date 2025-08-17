import { Module } from '@nestjs/common';
import { VerticalService } from './vertical.service';
import { VerticalController } from './vertical.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [VerticalController],
  providers: [VerticalService],
  exports: [VerticalService],
})
export class VerticalModule {}
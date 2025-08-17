import { Module } from '@nestjs/common';
import { ModuleService } from './module.service';
import { ModuleController } from './module.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ModuleController],
  providers: [ModuleService],
  exports: [ModuleService],
})
export class ModuleModule {}
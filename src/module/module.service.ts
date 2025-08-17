import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { BreadcrumbResponse } from '../vertical/dto/breadcrumb.dto';

@Injectable()
export class ModuleService {
  constructor(private prisma: PrismaService) {}

  async create(createModuleDto: CreateModuleDto) {
    return await this.prisma.module.create({
      data: createModuleDto,
      include: {
        batch: {
          include: {
            vertical: true,
          },
        },
        weeks: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.module.findMany({
      include: {
        batch: {
          include: {
            vertical: true,
          },
        },
        weeks: true,
      },
      orderBy: {
        moduleOrder: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const module = await this.prisma.module.findUnique({
      where: { id },
      include: {
        batch: {
          include: {
            vertical: true,
          },
        },
        weeks: {
          include: {
            lectures: true,
          },
        },
      },
    });

    if (!module) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }

    return module;
  }

  async update(id: string, updateModuleDto: UpdateModuleDto) {
    await this.findOne(id); // Check if exists

    return await this.prisma.module.update({
      where: { id },
      data: updateModuleDto,
      include: {
        batch: {
          include: {
            vertical: true,
          },
        },
        weeks: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return await this.prisma.module.delete({
      where: { id },
    });
  }

  async findByBatch(batchId: string) {
    return await this.prisma.module.findMany({
      where: { batchId },
      include: {
        batch: {
          include: {
            vertical: true,
          },
        },
        weeks: true,
      },
      orderBy: {
        moduleOrder: 'asc',
      },
    });
  }

  async getBreadcrumb(id: string): Promise<BreadcrumbResponse> {
    const module = await this.findOne(id);

    return {
      breadcrumbs: [
        {
          id: 'admin',
          name: 'Admin',
          type: 'vertical',
          url: '/admin',
        },
        {
          id: module.batch.vertical.id,
          name: module.batch.vertical.name,
          type: 'vertical',
          url: `/admin/verticals/${module.batch.vertical.id}`,
        },
        {
          id: module.batch.id,
          name: module.batch.name,
          type: 'batch',
          url: `/admin/verticals/${module.batch.vertical.id}/batches/${module.batch.id}`,
        },
      ],
      current: {
        id: module.id,
        name: module.name,
        type: 'module',
        url: `/admin/verticals/${module.batch.vertical.id}/batches/${module.batch.id}/modules/${module.id}`,
      },
    };
  }
}

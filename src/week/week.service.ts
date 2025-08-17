import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWeekDto } from './dto/create-week.dto';
import { UpdateWeekDto } from './dto/update-week.dto';
import { BreadcrumbResponse } from '../vertical/dto/breadcrumb.dto';

@Injectable()
export class WeekService {
  constructor(private prisma: PrismaService) {}

  async create(createWeekDto: CreateWeekDto) {
    return await this.prisma.week.create({
      data: createWeekDto,
      include: {
        module: {
          include: {
            batch: {
              include: {
                vertical: true,
              },
            },
          },
        },
        lectures: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.week.findMany({
      include: {
        module: {
          include: {
            batch: {
              include: {
                vertical: true,
              },
            },
          },
        },
        lectures: true,
      },
      orderBy: {
        weekNumber: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const week = await this.prisma.week.findUnique({
      where: { id },
      include: {
        module: {
          include: {
            batch: {
              include: {
                vertical: true,
              },
            },
          },
        },
        lectures: {
          orderBy: {
            lectureNumber: 'asc',
          },
        },
      },
    });

    if (!week) {
      throw new NotFoundException(`Week with ID ${id} not found`);
    }

    return week;
  }

  async update(id: string, updateWeekDto: UpdateWeekDto) {
    await this.findOne(id); // Check if exists

    return await this.prisma.week.update({
      where: { id },
      data: updateWeekDto,
      include: {
        module: {
          include: {
            batch: {
              include: {
                vertical: true,
              },
            },
          },
        },
        lectures: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return await this.prisma.week.delete({
      where: { id },
    });
  }

  async findByModule(moduleId: string) {
    return await this.prisma.week.findMany({
      where: { moduleId },
      include: {
        module: {
          include: {
            batch: {
              include: {
                vertical: true,
              },
            },
          },
        },
        lectures: true,
      },
      orderBy: {
        weekNumber: 'asc',
      },
    });
  }

  async getBreadcrumb(id: string): Promise<BreadcrumbResponse> {
    const week = await this.findOne(id);

    return {
      breadcrumbs: [
        {
          id: 'admin',
          name: 'Admin',
          type: 'vertical',
          url: '/admin',
        },
        {
          id: week.module.batch.vertical.id,
          name: week.module.batch.vertical.name,
          type: 'vertical',
          url: `/admin/verticals/${week.module.batch.vertical.id}`,
        },
        {
          id: week.module.batch.id,
          name: week.module.batch.name,
          type: 'batch',
          url: `/admin/verticals/${week.module.batch.vertical.id}/batches/${week.module.batch.id}`,
        },
        {
          id: week.module.id,
          name: week.module.name,
          type: 'module',
          url: `/admin/verticals/${week.module.batch.vertical.id}/batches/${week.module.batch.id}/modules/${week.module.id}`,
        },
      ],
      current: {
        id: week.id,
        name: week.name,
        type: 'week',
        url: `/admin/verticals/${week.module.batch.vertical.id}/batches/${week.module.batch.id}/modules/${week.module.id}/weeks/${week.id}`,
      },
    };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { BreadcrumbResponse } from '../vertical/dto/breadcrumb.dto';

@Injectable()
export class LectureService {
  constructor(private prisma: PrismaService) {}

  async create(createLectureDto: CreateLectureDto) {
    return await this.prisma.lecture.create({
      data: createLectureDto,
      include: {
        week: {
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
          },
        },
      },
    });
  }

  async findAll() {
    return await this.prisma.lecture.findMany({
      include: {
        week: {
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
          },
        },
      },
      orderBy: {
        scheduledAt: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const lecture = await this.prisma.lecture.findUnique({
      where: { id },
      include: {
        week: {
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
          },
        },
      },
    });

    if (!lecture) {
      throw new NotFoundException(`Lecture with ID ${id} not found`);
    }

    return lecture;
  }

  async update(id: string, updateLectureDto: UpdateLectureDto) {
    await this.findOne(id); // Check if exists

    return await this.prisma.lecture.update({
      where: { id },
      data: updateLectureDto,
      include: {
        week: {
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
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return await this.prisma.lecture.delete({
      where: { id },
    });
  }

  async findByWeek(weekId: string) {
    return await this.prisma.lecture.findMany({
      where: { weekId },
      include: {
        week: {
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
          },
        },
      },
      orderBy: {
        lectureNumber: 'asc',
      },
    });
  }

  async getBreadcrumb(id: string): Promise<BreadcrumbResponse> {
    const lecture = await this.findOne(id);

    return {
      breadcrumbs: [
        {
          id: 'admin',
          name: 'Admin',
          type: 'vertical',
          url: '/admin',
        },
        {
          id: lecture.week.module.batch.vertical.id,
          name: lecture.week.module.batch.vertical.name,
          type: 'vertical',
          url: `/admin/verticals/${lecture.week.module.batch.vertical.id}`,
        },
        {
          id: lecture.week.module.batch.id,
          name: lecture.week.module.batch.name,
          type: 'batch',
          url: `/admin/verticals/${lecture.week.module.batch.vertical.id}/batches/${lecture.week.module.batch.id}`,
        },
        {
          id: lecture.week.module.id,
          name: lecture.week.module.name,
          type: 'module',
          url: `/admin/verticals/${lecture.week.module.batch.vertical.id}/batches/${lecture.week.module.batch.id}/modules/${lecture.week.module.id}`,
        },
        {
          id: lecture.week.id,
          name: lecture.week.name,
          type: 'week',
          url: `/admin/verticals/${lecture.week.module.batch.vertical.id}/batches/${lecture.week.module.batch.id}/modules/${lecture.week.module.id}/weeks/${lecture.week.id}`,
        },
      ],
      current: {
        id: lecture.id,
        name: lecture.title,
        type: 'lecture',
        url: `/admin/verticals/${lecture.week.module.batch.vertical.id}/batches/${lecture.week.module.batch.id}/modules/${lecture.week.module.id}/weeks/${lecture.week.id}/lectures/${lecture.id}`,
      },
    };
  }

  async findUpcoming() {
    const now = new Date();
    return await this.prisma.lecture.findMany({
      where: {
        scheduledAt: {
          gte: now,
        },
        isActive: true,
      },
      include: {
        week: {
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
          },
        },
      },
      orderBy: {
        scheduledAt: 'asc',
      },
      take: 10,
    });
  }
}

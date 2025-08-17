import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { Prisma } from '@prisma/client';
import { BreadcrumbResponse } from '../vertical/dto/breadcrumb.dto';

@Injectable()
export class BatchService {
  constructor(private prisma: PrismaService) {}

  async create(createBatchDto: CreateBatchDto) {
    return await this.prisma.batch.create({
      data: createBatchDto,
      include: {
        vertical: true,
        modules: true,
      },
    });
  }

  async findAll(filters?: {
    search?: string;
    status?: string;
    verticalId?: string;
  }) {
    const where: Prisma.BatchWhereInput = {};

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters?.status) {
      where.isActive = filters.status === 'active';
    }

    if (filters?.verticalId) {
      where.verticalId = filters.verticalId;
    }

    return await this.prisma.batch.findMany({
      where,
      include: {
        vertical: true,
        modules: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const batch = await this.prisma.batch.findUnique({
      where: { id },
      include: {
        vertical: true,
        modules: {
          include: {
            weeks: {
              include: {
                lectures: true,
              },
            },
          },
        },
      },
    });

    if (!batch) {
      throw new NotFoundException(`Batch with ID ${id} not found`);
    }

    return batch;
  }

  async update(id: string, updateBatchDto: UpdateBatchDto) {
    await this.findOne(id); // Check if exists

    return await this.prisma.batch.update({
      where: { id },
      data: updateBatchDto,
      include: {
        vertical: true,
        modules: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return await this.prisma.batch.delete({
      where: { id },
    });
  }

  async findByVertical(verticalId: string) {
    return await this.prisma.batch.findMany({
      where: { verticalId },
      include: {
        vertical: true,
        modules: true,
      },
    });
  }

  async getBreadcrumb(id: string): Promise<BreadcrumbResponse> {
    const batch = await this.findOne(id);

    return {
      breadcrumbs: [
        {
          id: 'admin',
          name: 'Admin',
          type: 'vertical',
          url: '/admin',
        },
        {
          id: batch.vertical.id,
          name: batch.vertical.name,
          type: 'vertical',
          url: `/admin/verticals/${batch.vertical.id}`,
        },
      ],
      current: {
        id: batch.id,
        name: batch.name,
        type: 'batch',
        url: `/admin/verticals/${batch.vertical.id}/batches/${batch.id}`,
      },
    };
  }
}

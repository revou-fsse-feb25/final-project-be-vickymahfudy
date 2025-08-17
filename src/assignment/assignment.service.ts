import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { AssignmentStatus, Prisma } from '@prisma/client';

@Injectable()
export class AssignmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAssignmentDto: CreateAssignmentDto) {
    const { publishedAt, dueDate, ...data } = createAssignmentDto;

    return await this.prisma.assignment.create({
      data: {
        ...data,
        dueDate: new Date(dueDate),
        publishedAt: publishedAt ? new Date(publishedAt) : null,
      },
      include: {
        batch: {
          include: {
            vertical: true,
          },
        },
      },
    });
  }

  async findAll() {
    return await this.prisma.assignment.findMany({
      include: {
        batch: {
          include: {
            vertical: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByBatch(batchId: string) {
    // Verify batch exists
    const batch = await this.prisma.batch.findUnique({
      where: { id: batchId },
    });

    if (!batch) {
      throw new NotFoundException(`Batch with ID ${batchId} not found`);
    }

    return await this.prisma.assignment.findMany({
      where: { batchId },
      include: {
        batch: {
          include: {
            vertical: true,
          },
        },
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  async findPublished(batchId?: string) {
    const whereCondition: Prisma.AssignmentWhereInput = {
      status: AssignmentStatus.PUBLISHED,
    };

    if (batchId) {
      whereCondition.batchId = batchId;
    }

    return await this.prisma.assignment.findMany({
      where: whereCondition,
      include: {
        batch: {
          include: {
            vertical: true,
          },
        },
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
      include: {
        batch: {
          include: {
            vertical: true,
          },
        },
      },
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    return assignment;
  }

  async update(id: string, updateAssignmentDto: UpdateAssignmentDto) {
    await this.findOne(id); // Check if exists

    const { publishedAt, dueDate, ...data } = updateAssignmentDto;

    return await this.prisma.assignment.update({
      where: { id },
      data: {
        ...data,
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(publishedAt !== undefined && {
          publishedAt: publishedAt ? new Date(publishedAt) : null,
        }),
      } as Prisma.AssignmentUpdateInput,
      include: {
        batch: {
          include: {
            vertical: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return await this.prisma.assignment.delete({
      where: { id },
    });
  }

  async publish(id: string) {
    await this.findOne(id); // Check if exists

    return await this.prisma.assignment.update({
      where: { id },
      data: {
        status: AssignmentStatus.PUBLISHED,
        publishedAt: new Date(),
      },
      include: {
        batch: {
          include: {
            vertical: true,
          },
        },
      },
    });
  }

  async unpublish(id: string) {
    await this.findOne(id); // Check if exists

    return await this.prisma.assignment.update({
      where: { id },
      data: {
        status: AssignmentStatus.DRAFT,
        publishedAt: null,
      },
      include: {
        batch: {
          include: {
            vertical: true,
          },
        },
      },
    });
  }
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVerticalDto } from './dto/create-vertical.dto';
import { UpdateVerticalDto } from './dto/update-vertical.dto';
import { Prisma, VerticalType } from '@prisma/client';
import { BreadcrumbResponse } from './dto/breadcrumb.dto';

@Injectable()
export class VerticalService {
  constructor(private prisma: PrismaService) {}

  async create(createVerticalDto: CreateVerticalDto) {
    return await this.prisma.vertical.create({
      data: createVerticalDto,
    });
  }

  async findAll(filters?: { search?: string; status?: string; type?: string }) {
    const where: Prisma.VerticalWhereInput = {};

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters?.status) {
      where.isActive = filters.status === 'active';
    }

    if (filters?.type) {
      where.type = filters.type as VerticalType;
    }

    return await this.prisma.vertical.findMany({
      where,
      include: {
        batches: true,
      },
    });
  }

  async findOne(id: string) {
    const vertical = await this.prisma.vertical.findUnique({
      where: { id },
      include: {
        batches: true,
      },
    });

    if (!vertical) {
      throw new NotFoundException(`Vertical with ID ${id} not found`);
    }

    return vertical;
  }

  async update(id: string, updateVerticalDto: UpdateVerticalDto) {
    await this.findOne(id); // Check if exists

    return await this.prisma.vertical.update({
      where: { id },
      data: updateVerticalDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return await this.prisma.vertical.delete({
      where: { id },
    });
  }

  async getBreadcrumb(id: string): Promise<BreadcrumbResponse> {
    const vertical = await this.findOne(id);

    return {
      breadcrumbs: [
        {
          id: 'admin',
          name: 'Admin',
          type: 'vertical',
          url: '/admin',
        },
      ],
      current: {
        id: vertical.id,
        name: vertical.name,
        type: 'vertical',
        url: `/admin/verticals/${vertical.id}`,
      },
    };
  }
}

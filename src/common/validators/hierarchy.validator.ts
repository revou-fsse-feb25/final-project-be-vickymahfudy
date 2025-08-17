import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HierarchyValidator {
  constructor(private prisma: PrismaService) {}

  async validateBatchBelongsToVertical(
    batchId: string,
    verticalId: string,
  ): Promise<boolean> {
    const batch = await this.prisma.batch.findFirst({
      where: {
        id: batchId,
        verticalId: verticalId,
      },
    });
    return !!batch;
  }

  async validateModuleBelongsToBatch(
    moduleId: string,
    batchId: string,
  ): Promise<boolean> {
    const module = await this.prisma.module.findFirst({
      where: {
        id: moduleId,
        batchId: batchId,
      },
    });
    return !!module;
  }

  async validateWeekBelongsToModule(
    weekId: string,
    moduleId: string,
  ): Promise<boolean> {
    const week = await this.prisma.week.findFirst({
      where: {
        id: weekId,
        moduleId: moduleId,
      },
    });
    return !!week;
  }

  async validateLectureBelongsToWeek(
    lectureId: string,
    weekId: string,
  ): Promise<boolean> {
    const lecture = await this.prisma.lecture.findFirst({
      where: {
        id: lectureId,
        weekId: weekId,
      },
    });
    return !!lecture;
  }

  async validateFullHierarchy({
    verticalId,
    batchId,
    moduleId,
    weekId,
    lectureId,
  }: {
    verticalId?: string;
    batchId?: string;
    moduleId?: string;
    weekId?: string;
    lectureId?: string;
  }): Promise<boolean> {
    // Validate from bottom to top
    if (lectureId && weekId) {
      const isValid = await this.validateLectureBelongsToWeek(
        lectureId,
        weekId,
      );
      if (!isValid) return false;
    }

    if (weekId && moduleId) {
      const isValid = await this.validateWeekBelongsToModule(weekId, moduleId);
      if (!isValid) return false;
    }

    if (moduleId && batchId) {
      const isValid = await this.validateModuleBelongsToBatch(
        moduleId,
        batchId,
      );
      if (!isValid) return false;
    }

    if (batchId && verticalId) {
      const isValid = await this.validateBatchBelongsToVertical(
        batchId,
        verticalId,
      );
      if (!isValid) return false;
    }

    return true;
  }
}

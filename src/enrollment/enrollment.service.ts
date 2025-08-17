import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { EnrollmentStatus, Prisma, Assignment } from '@prisma/client';

export interface AssignmentWithProgress extends Assignment {
  batch: {
    id: string;
    name: string;
    vertical: {
      id: string;
      name: string;
    };
  };
  submission?: {
    id: string;
    submittedAt: Date;
    score?: number | null;
    feedback?: string | null;
  } | null;
  progressStatus: 'pending' | 'submitted' | 'graded' | 'overdue';
  isOverdue: boolean;
  daysUntilDue?: number | null;
}

@Injectable()
export class EnrollmentService {
  constructor(private prisma: PrismaService) {}

  async enrollStudent(
    userId: string,
    createEnrollmentDto: CreateEnrollmentDto,
  ) {
    const { batchId } = createEnrollmentDto;

    // Check if batch exists and is active
    const batch = await this.prisma.batch.findUnique({
      where: { id: batchId },
      include: { vertical: true },
    });

    if (!batch) {
      throw new NotFoundException(`Batch with ID ${batchId} not found`);
    }

    if (!batch.isActive) {
      throw new BadRequestException('This batch is not currently active');
    }

    // Check if user is already enrolled in this batch
    const existingEnrollment = await this.prisma.enrollment.findUnique({
      where: {
        unique_user_batch_enrollment: {
          userId,
          batchId,
        },
      },
    });

    if (existingEnrollment) {
      throw new ConflictException('You are already enrolled in this batch');
    }

    // Create enrollment with APPROVED status (auto-approve)
    return await this.prisma.enrollment.create({
      data: {
        userId,
        batchId,
        status: EnrollmentStatus.APPROVED,
      },
      include: {
        batch: {
          include: {
            vertical: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });
  }

  async getStudentEnrollments(userId: string) {
    return await this.prisma.enrollment.findMany({
      where: {
        userId,
        isActive: true,
      },
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

  async getAvailableBatches() {
    return await this.prisma.batch.findMany({
      where: {
        isActive: true,
        endDate: {
          gte: new Date(),
        },
      },
      include: {
        vertical: true,
        _count: {
          select: {
            enrollments: {
              where: {
                status: {
                  in: [EnrollmentStatus.APPROVED, EnrollmentStatus.ACTIVE],
                },
              },
            },
          },
        },
      },
      orderBy: {
        startDate: 'asc',
      },
    });
  }

  async updateEnrollmentStatus(enrollmentId: string, status: EnrollmentStatus) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId },
    });

    if (!enrollment) {
      throw new NotFoundException(
        `Enrollment with ID ${enrollmentId} not found`,
      );
    }

    const updateData: Prisma.EnrollmentUpdateInput = {
      status,
      updatedAt: new Date(),
    };

    if (status === EnrollmentStatus.APPROVED) {
      updateData.approvedAt = new Date();
    } else if (status === EnrollmentStatus.COMPLETED) {
      updateData.completedAt = new Date();
    }

    return await this.prisma.enrollment.update({
      where: { id: enrollmentId },
      data: updateData,
      include: {
        batch: {
          include: {
            vertical: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });
  }

  async getAllEnrollments(filters?: {
    status?: EnrollmentStatus;
    batchId?: string;
  }) {
    const where: Prisma.EnrollmentWhereInput = {
      isActive: true,
    };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.batchId) {
      where.batchId = filters.batchId;
    }

    return await this.prisma.enrollment.findMany({
      where,
      include: {
        batch: {
          include: {
            vertical: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getEnrolledBatchContent(userId: string, batchId: string) {
    // First verify that the user is enrolled in this batch
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        unique_user_batch_enrollment: {
          userId,
          batchId,
        },
        status: EnrollmentStatus.APPROVED,
        isActive: true,
      },
    });

    if (!enrollment) {
      throw new NotFoundException(
        'You are not enrolled in this batch or your enrollment is not approved',
      );
    }

    // Get batch content with modules, weeks, and lectures
    return await this.prisma.batch.findUnique({
      where: { id: batchId },
      include: {
        vertical: true,
        modules: {
          where: { isActive: true },
          include: {
            weeks: {
              where: { isActive: true },
              include: {
                lectures: {
                  where: { isActive: true },
                  orderBy: { lectureNumber: 'asc' },
                },
              },
              orderBy: { weekNumber: 'asc' },
            },
          },
          orderBy: { moduleOrder: 'asc' },
        },
      },
    });
  }

  async verifyEnrollmentAccess(
    userId: string,
    batchId: string,
  ): Promise<boolean> {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        unique_user_batch_enrollment: {
          userId,
          batchId,
        },
        status: EnrollmentStatus.APPROVED,
        isActive: true,
      },
    });

    return !!enrollment;
  }

  async getStudentAssignments(userId: string, batchId?: string) {
    // Get all batches the student is enrolled in
    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        userId,
        status: EnrollmentStatus.APPROVED,
        isActive: true,
        ...(batchId && { batchId }),
      },
      select: {
        batchId: true,
      },
    });

    const batchIds = enrollments.map((enrollment) => enrollment.batchId);

    if (batchIds.length === 0) {
      return [];
    }

    // Get published assignments for enrolled batches
    const assignments = await this.prisma.assignment.findMany({
      where: {
        batchId: {
          in: batchIds,
        },
        status: 'PUBLISHED',
      },
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

    // Return basic assignments without progress for now
    return assignments;
  }

  async getStudentAssignmentDetails(userId: string, assignmentId: string) {
    // First, get the assignment to check which batch it belongs to
    const assignment = await this.prisma.assignment.findUnique({
      where: {
        id: assignmentId,
        status: 'PUBLISHED',
      },
      include: {
        batch: {
          include: {
            vertical: true,
          },
        },
      },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found or not published');
    }

    // Check if the student is enrolled in the batch
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        unique_user_batch_enrollment: {
          userId,
          batchId: assignment.batchId,
        },
        status: EnrollmentStatus.APPROVED,
        isActive: true,
      },
    });

    if (!enrollment) {
      throw new NotFoundException(
        'Assignment not found or you are not enrolled in this batch',
      );
    }

    return assignment;
  }

  async getStudentAssignmentsWithProgress(
    userId: string,
    batchId?: string,
  ): Promise<AssignmentWithProgress[]> {
    // Get basic assignments first
    const assignments = await this.getStudentAssignments(userId, batchId);

    // Add progress information
    const assignmentsWithProgress: AssignmentWithProgress[] = [];

    for (const assignment of assignments) {
      // Check if user has submitted this assignment
      const submission = await this.prisma.submission.findFirst({
        where: {
          userId,
          assignmentId: assignment.id,
          isActive: true,
        },
        select: {
          id: true,
          submittedAt: true,
          score: true,
          feedback: true,
        },
      });

      // Calculate progress status
      const now = new Date();
      const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : null;

      let progressStatus: 'pending' | 'submitted' | 'graded' | 'overdue' =
        'pending';
      let isOverdue = false;
      let daysUntilDue: number | null = null;

      if (dueDate) {
        isOverdue = now > dueDate;
        daysUntilDue = Math.ceil(
          (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        );
      }

      // Determine progress status based on submission and due date
      if (submission) {
        if (submission.score !== null && submission.score !== undefined) {
          progressStatus = 'graded';
        } else {
          progressStatus = 'submitted';
        }
      } else if (isOverdue) {
        progressStatus = 'overdue';
      } else {
        progressStatus = 'pending';
      }

      assignmentsWithProgress.push({
        ...assignment,
        submission,
        progressStatus,
        isOverdue,
        daysUntilDue,
      });
    }

    return assignmentsWithProgress;
  }
}

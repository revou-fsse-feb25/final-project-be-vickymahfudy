import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { EnrollmentStatus, SubmissionType, Prisma } from '@prisma/client';

@Injectable()
export class SubmissionService {
  constructor(private prisma: PrismaService) {}

  async createSubmission(
    userId: string,
    createSubmissionDto: CreateSubmissionDto,
  ) {
    const { assignmentId, type, linkUrl, linkTitle, content } =
      createSubmissionDto;

    // Check if assignment exists and is published
    const assignment = await this.prisma.assignment.findFirst({
      where: {
        id: assignmentId,
        status: 'PUBLISHED',
        isActive: true,
      },
      include: {
        batch: true,
      },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found or not published');
    }

    // Check if user is enrolled in the batch
    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        userId,
        batchId: assignment.batchId,
        status: EnrollmentStatus.APPROVED,
        isActive: true,
      },
    });

    if (!enrollment) {
      throw new ForbiddenException('You are not enrolled in this batch');
    }

    // Check if assignment is still open (before due date)
    if (assignment.dueDate && new Date() > assignment.dueDate) {
      throw new BadRequestException(
        'Assignment submission deadline has passed',
      );
    }

    // Check if submission already exists (including soft-deleted ones)
    const existingSubmission = await this.prisma.submission.findFirst({
      where: {
        userId,
        assignmentId,
      },
    });

    // If there's an active submission, throw error
    if (existingSubmission && existingSubmission.isActive) {
      throw new BadRequestException(
        'You have already submitted this assignment',
      );
    }

    // Validate submission data based on type
    if (type === SubmissionType.LINK && !linkUrl) {
      throw new BadRequestException(
        'Link URL is required for link submissions',
      );
    }

    // If there's a soft-deleted submission, reactivate and update it
    if (existingSubmission && !existingSubmission.isActive) {
      return this.prisma.submission.update({
        where: { id: existingSubmission.id },
        data: {
          type,
          linkUrl,
          linkTitle,
          content,
          isActive: true,
          submittedAt: new Date(),
          score: null,
          feedback: null,
          gradedAt: null,
        },
        include: {
          assignment: {
            select: {
              id: true,
              title: true,
              dueDate: true,
            },
          },
        },
      });
    }

    // Create new submission
    return this.prisma.submission.create({
      data: {
        userId,
        assignmentId,
        type,
        linkUrl,
        linkTitle,
        content,
      },
      include: {
        assignment: {
          select: {
            id: true,
            title: true,
            dueDate: true,
          },
        },
      },
    });
  }

  async updateSubmission(
    userId: string,
    submissionId: string,
    updateSubmissionDto: UpdateSubmissionDto,
  ) {
    // Find submission
    const submission = await this.prisma.submission.findFirst({
      where: {
        id: submissionId,
        userId,
        isActive: true,
      },
      include: {
        assignment: true,
      },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    // Check if assignment is still open (before due date)
    if (
      submission.assignment.dueDate &&
      new Date() > submission.assignment.dueDate
    ) {
      throw new BadRequestException(
        'Cannot edit submission after assignment deadline',
      );
    }

    // Update submission
    return this.prisma.submission.update({
      where: { id: submissionId },
      data: updateSubmissionDto,
      include: {
        assignment: {
          select: {
            id: true,
            title: true,
            dueDate: true,
          },
        },
      },
    });
  }

  async deleteSubmission(userId: string, submissionId: string) {
    // Find submission
    const submission = await this.prisma.submission.findFirst({
      where: {
        id: submissionId,
        userId,
        isActive: true,
      },
      include: {
        assignment: true,
      },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    // Check if assignment is still open (before due date)
    if (
      submission.assignment.dueDate &&
      new Date() > submission.assignment.dueDate
    ) {
      throw new BadRequestException(
        'Cannot delete submission after assignment deadline',
      );
    }

    // Soft delete submission
    return this.prisma.submission.update({
      where: { id: submissionId },
      data: { isActive: false },
    });
  }

  async getMySubmissions(userId: string, assignmentId?: string) {
    const where: Prisma.SubmissionWhereInput = {
      userId,
      isActive: true,
    };

    if (assignmentId) {
      where.assignmentId = assignmentId;
    }

    return this.prisma.submission.findMany({
      where,
      include: {
        assignment: {
          select: {
            id: true,
            title: true,
            dueDate: true,
            maxScore: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });
  }

  async getSubmissionById(userId: string, submissionId: string) {
    const submission = await this.prisma.submission.findFirst({
      where: {
        id: submissionId,
        userId,
        isActive: true,
      },
      include: {
        assignment: {
          select: {
            id: true,
            title: true,
            dueDate: true,
            maxScore: true,
          },
        },
      },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    return submission;
  }
}

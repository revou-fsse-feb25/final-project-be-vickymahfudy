import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { StudentGuard } from '../auth/guards/student.guard';
import { EnrollmentGuard } from '../auth/guards/enrollment.guard';
import { EnrollmentStatus } from '@prisma/client';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

interface RequestWithUser extends Request {
  user: JwtPayload;
}

@ApiTags('enrollments')
@ApiBearerAuth('bearer')
@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  @UseGuards(JwtGuard, StudentGuard)
  @ApiOperation({
    summary: 'Enroll in a batch',
    description: 'Allow students to enroll in available batches.',
  })
  @ApiBody({
    type: CreateEnrollmentDto,
    description: 'Enrollment data',
    examples: {
      example1: {
        summary: 'Enroll in Software Engineering batch',
        description: 'Example of enrolling in a batch',
        value: {
          batchId: 'clxxxxx',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully enrolled in batch',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clxxxxx' },
        status: { type: 'string', example: 'PENDING' },
        enrolledAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        userId: { type: 'string', example: 'clxxxxx' },
        batchId: { type: 'string', example: 'clxxxxx' },
        batch: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clxxxxx' },
            name: { type: 'string', example: 'Oct25' },
            description: {
              type: 'string',
              example: 'October 2025 Software Engineering Batch',
            },
            vertical: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'clxxxxx' },
                name: { type: 'string', example: 'Software Engineering' },
              },
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Student access required' })
  @ApiBadRequestResponse({ description: 'Invalid input or batch not active' })
  @ApiNotFoundResponse({ description: 'Batch not found' })
  @ApiConflictResponse({ description: 'Already enrolled in this batch' })
  async enroll(
    @Request() req: RequestWithUser,
    @Body() createEnrollmentDto: CreateEnrollmentDto,
  ) {
    return this.enrollmentService.enrollStudent(
      req.user.sub,
      createEnrollmentDto,
    );
  }

  @Get('available-batches')
  @UseGuards(JwtGuard, StudentGuard)
  @ApiOperation({
    summary: 'Get available batches for enrollment',
    description: 'Retrieve all active batches that students can enroll in.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of available batches retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'clxxxxx' },
          name: { type: 'string', example: 'Oct25' },
          description: {
            type: 'string',
            example: 'October 2025 Software Engineering Batch',
          },
          startDate: { type: 'string', example: '2025-10-01T00:00:00.000Z' },
          endDate: { type: 'string', example: '2026-04-01T00:00:00.000Z' },
          vertical: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'clxxxxx' },
              name: { type: 'string', example: 'Software Engineering' },
              description: {
                type: 'string',
                example: 'Full-stack software development program',
              },
            },
          },
          _count: {
            type: 'object',
            properties: {
              enrollments: { type: 'number', example: 25 },
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Student access required' })
  async getAvailableBatches() {
    return this.enrollmentService.getAvailableBatches();
  }

  @Get('my-enrollments')
  @UseGuards(JwtGuard, StudentGuard)
  @ApiOperation({
    summary: 'Get student enrollments',
    description: 'Retrieve all enrollments for the authenticated student.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of student enrollments retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'clxxxxx' },
          status: { type: 'string', example: 'APPROVED' },
          enrolledAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          approvedAt: { type: 'string', example: '2024-01-02T00:00:00.000Z' },
          batch: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'clxxxxx' },
              name: { type: 'string', example: 'Oct25' },
              description: {
                type: 'string',
                example: 'October 2025 Software Engineering Batch',
              },
              startDate: {
                type: 'string',
                example: '2025-10-01T00:00:00.000Z',
              },
              endDate: { type: 'string', example: '2026-04-01T00:00:00.000Z' },
              vertical: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: 'clxxxxx' },
                  name: { type: 'string', example: 'Software Engineering' },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Student access required' })
  async getMyEnrollments(@Request() req: RequestWithUser) {
    return this.enrollmentService.getStudentEnrollments(req.user.sub);
  }

  @Get('batch/:batchId/content')
  @UseGuards(JwtGuard, StudentGuard, EnrollmentGuard)
  @ApiOperation({
    summary: 'Get enrolled batch content',
    description:
      'Retrieve content (modules, weeks, lectures) for an enrolled batch.',
  })
  @ApiParam({
    name: 'batchId',
    description: 'Batch ID',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Batch content retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clxxxxx' },
        name: { type: 'string', example: 'Oct25' },
        description: {
          type: 'string',
          example: 'October 2025 Software Engineering Batch',
        },
        vertical: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clxxxxx' },
            name: { type: 'string', example: 'Software Engineering' },
          },
        },
        modules: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'clxxxxx' },
              name: { type: 'string', example: 'Frontend Development' },
              description: { type: 'string' },
              weeks: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', example: 'clxxxxx' },
                    name: { type: 'string', example: 'HTML & CSS Basics' },
                    lectures: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string', example: 'clxxxxx' },
                          title: {
                            type: 'string',
                            example: 'Introduction to HTML',
                          },
                          description: { type: 'string' },
                          zoomLink: { type: 'string' },
                          deckLink: { type: 'string' },
                          scheduledAt: { type: 'string' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Batch not found or not enrolled' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Student access required' })
  async getBatchContent(
    @Param('batchId') batchId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.enrollmentService.getEnrolledBatchContent(
      req.user.sub,
      batchId,
    );
  }

  @Get()
  @UseGuards(JwtGuard, AdminGuard)
  @ApiOperation({
    summary: 'Get all enrollments (Admin only)',
    description: 'Retrieve all enrollments with optional filtering.',
  })
  @ApiQuery({
    name: 'status',
    description: 'Filter by enrollment status',
    required: false,
    enum: EnrollmentStatus,
  })
  @ApiQuery({
    name: 'batchId',
    description: 'Filter by batch ID',
    required: false,
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'List of enrollments retrieved successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  async getAllEnrollments(
    @Query('status') status?: EnrollmentStatus,
    @Query('batchId') batchId?: string,
  ) {
    return this.enrollmentService.getAllEnrollments({ status, batchId });
  }

  @Patch(':id/status')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiOperation({
    summary: 'Update enrollment status (Admin only)',
    description: 'Update the status of a student enrollment.',
  })
  @ApiParam({
    name: 'id',
    description: 'Enrollment ID',
    example: 'clxxxxx',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: Object.values(EnrollmentStatus),
          example: 'APPROVED',
        },
      },
      required: ['status'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Enrollment status updated successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  @ApiNotFoundResponse({ description: 'Enrollment not found' })
  async updateEnrollmentStatus(
    @Param('id') id: string,
    @Body('status') status: EnrollmentStatus,
  ) {
    return this.enrollmentService.updateEnrollmentStatus(id, status);
  }

  @Get('my-assignments')
  @UseGuards(JwtGuard, StudentGuard)
  @ApiOperation({
    summary: 'Get student assignments with progress',
    description:
      'Retrieve all published assignments for enrolled batches with submission status and progress.',
  })
  @ApiQuery({
    name: 'batchId',
    description: 'Filter by specific batch ID (optional)',
    required: false,
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description:
      'List of student assignments with progress retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'clxxxxx' },
          title: {
            type: 'string',
            example: 'Final Project - E-commerce Website',
          },
          description: {
            type: 'string',
            example:
              'Build a complete e-commerce website using React and Node.js',
          },
          type: {
            type: 'string',
            enum: ['PROJECT', 'INDIVIDUAL'],
            example: 'PROJECT',
          },
          status: {
            type: 'string',
            enum: ['PUBLISHED'],
            example: 'PUBLISHED',
          },
          maxScore: { type: 'number', example: 100 },
          dueDate: { type: 'string', example: '2024-12-31T23:59:59.000Z' },
          publishedAt: {
            type: 'string',
            example: '2024-11-01T09:00:00.000Z',
          },
          batch: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'clxxxxx' },
              name: { type: 'string', example: 'Oct25' },
              vertical: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: 'clxxxxx' },
                  name: { type: 'string', example: 'Software Engineering' },
                },
              },
            },
          },
          submission: {
            type: 'object',
            nullable: true,
            properties: {
              id: { type: 'string', example: 'clxxxxx' },
              submittedAt: {
                type: 'string',
                example: '2024-12-15T10:30:00.000Z',
              },
              score: { type: 'number', nullable: true, example: 85 },
              feedback: {
                type: 'string',
                nullable: true,
                example: 'Great work!',
              },
            },
          },
          progressStatus: {
            type: 'string',
            enum: ['pending', 'submitted', 'graded', 'overdue'],
            example: 'submitted',
          },
          isOverdue: { type: 'boolean', example: false },
          daysUntilDue: { type: 'number', nullable: true, example: 5 },
          createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Student access required' })
  async getMyAssignments(
    @Request() req: RequestWithUser,
    @Query('batchId') batchId?: string,
  ) {
    return this.enrollmentService.getStudentAssignmentsWithProgress(
      req.user.sub,
      batchId,
    );
  }

  @Get('my-assignments/:assignmentId')
  @UseGuards(JwtGuard, StudentGuard)
  @ApiOperation({
    summary: 'Get assignment details for student',
    description:
      'Retrieve assignment details if student is enrolled in the batch.',
  })
  @ApiParam({
    name: 'assignmentId',
    description: 'Assignment ID',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Assignment details retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clxxxxx' },
        title: {
          type: 'string',
          example: 'Final Project - E-commerce Website',
        },
        description: {
          type: 'string',
          example:
            'Build a complete e-commerce website using React and Node.js',
        },
        type: {
          type: 'string',
          enum: ['PROJECT', 'INDIVIDUAL'],
          example: 'PROJECT',
        },
        status: {
          type: 'string',
          enum: ['PUBLISHED'],
          example: 'PUBLISHED',
        },
        maxScore: { type: 'number', example: 100 },
        dueDate: { type: 'string', example: '2024-12-31T23:59:59.000Z' },
        publishedAt: {
          type: 'string',
          example: '2024-11-01T09:00:00.000Z',
        },
        batch: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clxxxxx' },
            name: { type: 'string', example: 'Oct25' },
            vertical: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'clxxxxx' },
                name: { type: 'string', example: 'Software Engineering' },
              },
            },
          },
        },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Student access required' })
  @ApiNotFoundResponse({
    description: 'Assignment not found or not accessible',
  })
  async getMyAssignmentDetails(
    @Request() req: RequestWithUser,
    @Param('assignmentId') assignmentId: string,
  ) {
    return await this.enrollmentService.getStudentAssignmentDetails(
      req.user.sub,
      assignmentId,
    );
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('assignments')
@ApiBearerAuth('bearer')
@Controller('assignments')
@UseGuards(AdminGuard)
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new assignment',
    description:
      'Create a new assignment within a batch. Only accessible by admin users.',
  })
  @ApiBody({
    type: CreateAssignmentDto,
    description: 'Assignment creation data',
    examples: {
      example1: {
        summary: 'Project Assignment',
        description: 'Example of creating a project assignment',
        value: {
          title: 'Final Project - E-commerce Website',
          description:
            'Build a complete e-commerce website using React and Node.js',
          type: 'PROJECT',
          status: 'DRAFT',
          maxScore: 100,
          dueDate: '2024-12-31T23:59:59.000Z',
          batchId: 'clxxxxx',
        },
      },
      example2: {
        summary: 'Individual Assignment',
        description: 'Example of creating an individual assignment',
        value: {
          title: 'JavaScript Fundamentals Quiz',
          description: 'Complete the JavaScript fundamentals quiz',
          type: 'INDIVIDUAL',
          status: 'PUBLISHED',
          maxScore: 50,
          dueDate: '2024-11-15T23:59:59.000Z',
          publishedAt: '2024-11-01T09:00:00.000Z',
          batchId: 'clxxxxx',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Assignment successfully created',
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
          example: 'Build a complete e-commerce website using React and Node.js',
        },
        type: {
          type: 'string',
          enum: ['PROJECT', 'INDIVIDUAL'],
          example: 'PROJECT',
        },
        status: {
          type: 'string',
          enum: ['DRAFT', 'PUBLISHED'],
          example: 'DRAFT',
        },
        maxScore: {
          type: 'number', example: 100 },
        dueDate: { type: 'string', example: '2024-12-31T23:59:59.000Z' },
        publishedAt: { type: 'string', example: null },
        batchId: { type: 'string', example: 'clxxxxx' },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  create(@Body() createAssignmentDto: CreateAssignmentDto) {
    return this.assignmentService.create(createAssignmentDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all assignments',
    description: 'Retrieve a list of all assignments in the LMS system.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of assignments retrieved successfully',
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
            enum: ['DRAFT', 'PUBLISHED'],
            example: 'DRAFT',
          },
          maxScore: { type: 'number', example: 100 },
          dueDate: { type: 'string', example: '2024-12-31T23:59:59.000Z' },
          publishedAt: { type: 'string', example: null },
          batchId: { type: 'string', example: 'clxxxxx' },
          createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  findAll() {
    return this.assignmentService.findAll();
  }

  @Get('batch/:batchId')
  @ApiOperation({
    summary: 'Get assignments by batch',
    description: 'Retrieve all assignments belonging to a specific batch.',
  })
  @ApiParam({
    name: 'batchId',
    description: 'Batch ID',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'List of assignments for the batch retrieved successfully',
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
            enum: ['DRAFT', 'PUBLISHED'],
            example: 'DRAFT',
          },
          maxScore: { type: 'number', example: 100 },
          dueDate: { type: 'string', example: '2024-12-31T23:59:59.000Z' },
          publishedAt: { type: 'string', example: null },
          batchId: { type: 'string', example: 'clxxxxx' },
          createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Batch not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  findByBatch(@Param('batchId') batchId: string) {
    return this.assignmentService.findByBatch(batchId);
  }

  @Get('published')
  @ApiOperation({
    summary: 'Get published assignments',
    description: 'Retrieve all published assignments.',
  })
  @ApiQuery({
    name: 'batchId',
    description: 'Filter by batch ID (optional)',
    required: false,
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'List of published assignments retrieved successfully',
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
          batchId: { type: 'string', example: 'clxxxxx' },
          createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  findPublished(@Query('batchId') batchId?: string) {
    return this.assignmentService.findPublished(batchId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get assignment by ID',
    description: 'Retrieve a specific assignment by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Assignment ID',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Assignment retrieved successfully',
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
          example: 'Build a complete e-commerce website using React and Node.js',
        },
        type: {
          type: 'string',
          enum: ['PROJECT', 'INDIVIDUAL'],
          example: 'PROJECT',
        },
        status: {
          type: 'string',
          enum: ['DRAFT', 'PUBLISHED'],
          example: 'DRAFT',
        },
        maxScore: { type: 'number', example: 100 },
        dueDate: { type: 'string', example: '2024-12-31T23:59:59.000Z' },
        publishedAt: { type: 'string', example: null },
        batchId: { type: 'string', example: 'clxxxxx' },
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
  @ApiNotFoundResponse({ description: 'Assignment not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  findOne(@Param('id') id: string) {
    return this.assignmentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update assignment',
    description: 'Update an existing assignment by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Assignment ID',
    example: 'clxxxxx',
  })
  @ApiBody({
    type: UpdateAssignmentDto,
    description: 'Assignment update data',
    examples: {
      example1: {
        summary: 'Update assignment title',
        description: 'Example of updating assignment title',
        value: {
          title: 'Advanced E-commerce Project',
        },
      },
      example2: {
        summary: 'Update due date',
        description: 'Example of updating assignment due date',
        value: {
          dueDate: '2025-01-15T23:59:59.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Assignment updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clxxxxx' },
        title: {
          type: 'string',
          example: 'Advanced E-commerce Project',
        },
        description: {
          type: 'string',
          example: 'Build a complete e-commerce website using React and Node.js',
        },
        type: {
          type: 'string',
          enum: ['PROJECT', 'INDIVIDUAL'],
          example: 'PROJECT',
        },
        status: {
          type: 'string',
          enum: ['DRAFT', 'PUBLISHED'],
          example: 'DRAFT',
        },
        maxScore: { type: 'number', example: 100 },
        dueDate: { type: 'string', example: '2025-01-15T23:59:59.000Z' },
        publishedAt: { type: 'string', example: null },
        batchId: { type: 'string', example: 'clxxxxx' },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Assignment not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  update(
    @Param('id') id: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ) {
    return this.assignmentService.update(id, updateAssignmentDto);
  }

  @Patch(':id/publish')
  @ApiOperation({
    summary: 'Publish assignment',
    description: 'Publish a draft assignment to make it available to students.',
  })
  @ApiParam({
    name: 'id',
    description: 'Assignment ID',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Assignment published successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clxxxxx' },
        title: {
          type: 'string',
          example: 'Final Project - E-commerce Website',
        },
        status: {
          type: 'string',
          enum: ['PUBLISHED'],
          example: 'PUBLISHED',
        },
        publishedAt: {
          type: 'string',
          example: '2024-11-01T09:00:00.000Z',
        },
        updatedAt: { type: 'string', example: '2024-11-01T09:00:00.000Z' },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Assignment not found' })
  @ApiBadRequestResponse({ description: 'Assignment is already published' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  publish(@Param('id') id: string) {
    return this.assignmentService.publish(id);
  }

  @Patch(':id/unpublish')
  @ApiOperation({
    summary: 'Unpublish assignment',
    description: 'Unpublish a published assignment to make it draft again.',
  })
  @ApiParam({
    name: 'id',
    description: 'Assignment ID',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Assignment unpublished successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clxxxxx' },
        title: {
          type: 'string',
          example: 'Final Project - E-commerce Website',
        },
        status: { type: 'string', enum: ['DRAFT'], example: 'DRAFT' },
        publishedAt: { type: 'string', example: null },
        updatedAt: { type: 'string', example: '2024-11-01T09:00:00.000Z' },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Assignment not found' })
  @ApiBadRequestResponse({ description: 'Assignment is already draft' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  unpublish(@Param('id') id: string) {
    return this.assignmentService.unpublish(id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete assignment',
    description: 'Delete an existing assignment by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Assignment ID',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Assignment deleted successfully',
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
          example: 'Build a complete e-commerce website using React and Node.js',
        },
        type: {
          type: 'string',
          enum: ['PROJECT', 'INDIVIDUAL'],
          example: 'PROJECT',
        },
        status: {
          type: 'string',
          enum: ['DRAFT', 'PUBLISHED'],
          example: 'DRAFT',
        },
        maxScore: { type: 'number', example: 100 },
        dueDate: { type: 'string', example: '2024-12-31T23:59:59.000Z' },
        publishedAt: { type: 'string', example: null },
        batchId: { type: 'string', example: 'clxxxxx' },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Assignment not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  remove(@Param('id') id: string) {
    return this.assignmentService.remove(id);
  }
}
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
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
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { StudentGuard } from '../auth/guards/student.guard';

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

@ApiTags('submissions')
@ApiBearerAuth('bearer')
@Controller('submissions')
@UseGuards(JwtGuard, StudentGuard)
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  @ApiOperation({
    summary: 'Submit assignment',
    description:
      'Submit a link for an assignment. Only link submissions are allowed.',
  })
  @ApiBody({
    type: CreateSubmissionDto,
    description: 'Submission data',
    examples: {
      example1: {
        summary: 'Link Submission',
        description: 'Example of submitting a link for assignment',
        value: {
          type: 'LINK',
          linkUrl: 'https://github.com/username/project',
          linkTitle: 'My Project Repository',
          content: 'This is my final project submission',
          assignmentId: 'clxxxxx',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Assignment submitted successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clxxxxx' },
        type: { type: 'string', example: 'LINK' },
        linkUrl: {
          type: 'string',
          example: 'https://github.com/username/project',
        },
        linkTitle: { type: 'string', example: 'My Project Repository' },
        content: {
          type: 'string',
          example: 'This is my final project submission',
        },
        submittedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        assignment: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clxxxxx' },
            title: { type: 'string', example: 'Final Project' },
            dueDate: { type: 'string', example: '2024-12-31T23:59:59.000Z' },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or deadline passed',
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({
    description: 'Student access required or not enrolled',
  })
  @ApiNotFoundResponse({ description: 'Assignment not found' })
  async create(
    @Request() req: RequestWithUser,
    @Body() createSubmissionDto: CreateSubmissionDto,
  ) {
    return this.submissionService.createSubmission(
      req.user.sub,
      createSubmissionDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get my submissions',
    description: 'Retrieve all submissions by the authenticated student.',
  })
  @ApiQuery({
    name: 'assignmentId',
    description: 'Filter by assignment ID (optional)',
    required: false,
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Submissions retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'clxxxxx' },
          type: { type: 'string', example: 'LINK' },
          linkUrl: {
            type: 'string',
            example: 'https://github.com/username/project',
          },
          linkTitle: { type: 'string', example: 'My Project Repository' },
          content: { type: 'string', example: 'This is my project submission' },
          submittedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          score: { type: 'number', example: 85 },
          feedback: { type: 'string', example: 'Good work!' },
          assignment: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'clxxxxx' },
              title: { type: 'string', example: 'Final Project' },
              dueDate: { type: 'string', example: '2024-12-31T23:59:59.000Z' },
              maxScore: { type: 'number', example: 100 },
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Student access required' })
  async findAll(
    @Request() req: RequestWithUser,
    @Query('assignmentId') assignmentId?: string,
  ) {
    return this.submissionService.getMySubmissions(req.user.sub, assignmentId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get submission by ID',
    description: 'Retrieve a specific submission by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Submission ID',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Submission retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clxxxxx' },
        type: { type: 'string', example: 'LINK' },
        linkUrl: {
          type: 'string',
          example: 'https://github.com/username/project',
        },
        linkTitle: { type: 'string', example: 'My Project Repository' },
        content: { type: 'string', example: 'This is my project submission' },
        submittedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        score: { type: 'number', example: 85 },
        feedback: { type: 'string', example: 'Good work!' },
        assignment: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clxxxxx' },
            title: { type: 'string', example: 'Final Project' },
            dueDate: { type: 'string', example: '2024-12-31T23:59:59.000Z' },
            maxScore: { type: 'number', example: 100 },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Submission not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Student access required' })
  async findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.submissionService.getSubmissionById(req.user.sub, id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update submission',
    description:
      'Update a submission. Only allowed before assignment due date.',
  })
  @ApiParam({
    name: 'id',
    description: 'Submission ID',
    example: 'clxxxxx',
  })
  @ApiBody({
    type: UpdateSubmissionDto,
    description: 'Updated submission data',
    examples: {
      example1: {
        summary: 'Update Link Submission',
        description: 'Example of updating a link submission',
        value: {
          linkUrl: 'https://github.com/username/updated-project',
          linkTitle: 'My Updated Project Repository',
          content: 'Updated submission with improvements',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Submission updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clxxxxx' },
        type: { type: 'string', example: 'LINK' },
        linkUrl: {
          type: 'string',
          example: 'https://github.com/username/updated-project',
        },
        linkTitle: { type: 'string', example: 'My Updated Project Repository' },
        content: {
          type: 'string',
          example: 'Updated submission with improvements',
        },
        submittedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        assignment: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clxxxxx' },
            title: { type: 'string', example: 'Final Project' },
            dueDate: { type: 'string', example: '2024-12-31T23:59:59.000Z' },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or deadline passed',
  })
  @ApiNotFoundResponse({ description: 'Submission not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Student access required' })
  async update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateSubmissionDto: UpdateSubmissionDto,
  ) {
    return this.submissionService.updateSubmission(
      req.user.sub,
      id,
      updateSubmissionDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete submission',
    description:
      'Delete a submission. Only allowed before assignment due date.',
  })
  @ApiParam({
    name: 'id',
    description: 'Submission ID',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Submission deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Submission deleted successfully' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Cannot delete after deadline' })
  @ApiNotFoundResponse({ description: 'Submission not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Student access required' })
  async remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    await this.submissionService.deleteSubmission(req.user.sub, id);
    return { message: 'Submission deleted successfully' };
  }
}

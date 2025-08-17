import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
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
} from '@nestjs/swagger';
import { LectureService } from './lecture.service';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { AdminGuard } from '../auth/guards/admin.guard';
import { BreadcrumbResponse } from '../vertical/dto/breadcrumb.dto';

@ApiTags('lectures')
@ApiBearerAuth('bearer')
@Controller('lectures')
@UseGuards(AdminGuard)
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new lecture',
    description:
      'Create a new lecture within a week. Only accessible by admin users.',
  })
  @ApiBody({
    type: CreateLectureDto,
    description: 'Lecture creation data',
    examples: {
      example1: {
        summary: 'Introduction to JavaScript',
        description: 'Example of creating a lecture for JavaScript basics',
        value: {
          title: 'Introduction to JavaScript',
          description: 'Learn the basics of JavaScript programming',
          lectureNumber: 1,
          duration: 120,
          scheduledAt: '2025-10-07T10:00:00.000Z',
          zoomLink: 'https://zoom.us/j/123456789',
          deckLink: 'https://slides.com/intro-js',
          weekId: 'clxxxxx',
          isActive: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Lecture successfully created',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clxxxxx' },
        title: { type: 'string', example: 'Introduction to JavaScript' },
        description: {
          type: 'string',
          example: 'Learn the basics of JavaScript programming',
        },
        lectureNumber: { type: 'number', example: 1 },
        duration: { type: 'number', example: 120 },
        scheduledAt: { type: 'string', example: '2025-10-07T10:00:00.000Z' },
        zoomLink: { type: 'string', example: 'https://zoom.us/j/123456789' },
        deckLink: { type: 'string', example: 'https://slides.com/intro-js' },
        weekId: { type: 'string', example: 'clxxxxx' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  create(@Body() createLectureDto: CreateLectureDto) {
    return this.lectureService.create(createLectureDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all lectures',
    description: 'Retrieve a list of all lectures in the LMS system.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of lectures retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'clxxxxx' },
          title: { type: 'string', example: 'Introduction to JavaScript' },
          description: {
            type: 'string',
            example: 'Learn the basics of JavaScript programming',
          },
          lectureNumber: { type: 'number', example: 1 },
          duration: { type: 'number', example: 120 },
          scheduledAt: { type: 'string', example: '2025-10-07T10:00:00.000Z' },
          zoomLink: { type: 'string', example: 'https://zoom.us/j/123456789' },
          deckLink: { type: 'string', example: 'https://slides.com/intro-js' },
          weekId: { type: 'string', example: 'clxxxxx' },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  findAll() {
    return this.lectureService.findAll();
  }

  @Get('week/:weekId')
  @ApiOperation({
    summary: 'Get lectures by week',
    description: 'Retrieve all lectures belonging to a specific week.',
  })
  @ApiParam({
    name: 'weekId',
    description: 'Week ID',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'List of lectures for the week retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'clxxxxx' },
          title: { type: 'string', example: 'Introduction to JavaScript' },
          description: {
            type: 'string',
            example: 'Learn the basics of JavaScript programming',
          },
          lectureNumber: { type: 'number', example: 1 },
          duration: { type: 'number', example: 120 },
          scheduledAt: { type: 'string', example: '2025-10-07T10:00:00.000Z' },
          zoomLink: { type: 'string', example: 'https://zoom.us/j/123456789' },
          deckLink: { type: 'string', example: 'https://slides.com/intro-js' },
          weekId: { type: 'string', example: 'clxxxxx' },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Week not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  findByWeek(@Param('weekId') weekId: string) {
    return this.lectureService.findByWeek(weekId);
  }

  @Get(':id/breadcrumb')
  @ApiOperation({ summary: 'Get breadcrumb navigation for a lecture' })
  @ApiParam({ name: 'id', description: 'Lecture ID' })
  @ApiResponse({
    status: 200,
    description: 'Breadcrumb retrieved successfully',
  })
  async getBreadcrumb(@Param('id') id: string): Promise<BreadcrumbResponse> {
    return this.lectureService.getBreadcrumb(id);
  }

  @Get('upcoming')
  @ApiOperation({
    summary: 'Get upcoming lectures',
    description: 'Retrieve all upcoming lectures scheduled for the future.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of upcoming lectures retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'clxxxxx' },
          title: { type: 'string', example: 'Introduction to JavaScript' },
          description: {
            type: 'string',
            example: 'Learn the basics of JavaScript programming',
          },
          lectureNumber: { type: 'number', example: 1 },
          duration: { type: 'number', example: 120 },
          scheduledAt: { type: 'string', example: '2025-10-07T10:00:00.000Z' },
          zoomLink: { type: 'string', example: 'https://zoom.us/j/123456789' },
          deckLink: { type: 'string', example: 'https://slides.com/intro-js' },
          weekId: { type: 'string', example: 'clxxxxx' },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  findUpcoming() {
    return this.lectureService.findUpcoming();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get lecture by ID',
    description: 'Retrieve a specific lecture by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Lecture ID',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Lecture retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clxxxxx' },
        title: { type: 'string', example: 'Introduction to JavaScript' },
        description: {
          type: 'string',
          example: 'Learn the basics of JavaScript programming',
        },
        lectureNumber: { type: 'number', example: 1 },
        duration: { type: 'number', example: 120 },
        scheduledAt: { type: 'string', example: '2025-10-07T10:00:00.000Z' },
        zoomLink: { type: 'string', example: 'https://zoom.us/j/123456789' },
        deckLink: { type: 'string', example: 'https://slides.com/intro-js' },
        weekId: { type: 'string', example: 'clxxxxx' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Lecture not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  findOne(@Param('id') id: string) {
    return this.lectureService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update lecture',
    description: 'Update an existing lecture by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Lecture ID',
    example: 'clxxxxx',
  })
  @ApiBody({
    type: UpdateLectureDto,
    description: 'Lecture update data',
    examples: {
      example1: {
        summary: 'Update lecture title',
        description: 'Example of updating lecture title',
        value: {
          title: 'Advanced JavaScript Concepts',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Lecture updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clxxxxx' },
        title: { type: 'string', example: 'Advanced JavaScript Concepts' },
        description: {
          type: 'string',
          example: 'Learn advanced JavaScript programming concepts',
        },
        lectureNumber: { type: 'number', example: 2 },
        duration: { type: 'number', example: 120 },
        scheduledAt: { type: 'string', example: '2025-10-14T10:00:00.000Z' },
        zoomLink: { type: 'string', example: 'https://zoom.us/j/123456789' },
        deckLink: { type: 'string', example: 'https://slides.com/advanced-js' },
        weekId: { type: 'string', example: 'clxxxxx' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Lecture not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  update(@Param('id') id: string, @Body() updateLectureDto: UpdateLectureDto) {
    return this.lectureService.update(id, updateLectureDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete lecture',
    description: 'Delete an existing lecture by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Lecture ID',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Lecture deleted successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clxxxxx' },
        title: { type: 'string', example: 'Introduction to Python' },
        description: {
          type: 'string',
          example: 'Learn the basics of Python programming',
        },
        weekId: { type: 'string', example: 'clxxxxx' },
        date: { type: 'string', example: '2024-02-05T10:00:00.000Z' },
        duration: { type: 'number', example: 120 },
        videoUrl: { type: 'string', example: 'https://example.com/video' },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Lecture not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  remove(@Param('id') id: string) {
    return this.lectureService.remove(id);
  }
}

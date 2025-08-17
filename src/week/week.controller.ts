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
import { WeekService } from './week.service';
import { CreateWeekDto } from './dto/create-week.dto';
import { UpdateWeekDto } from './dto/update-week.dto';
import { AdminGuard } from '../auth/guards/admin.guard';
import { BreadcrumbResponse } from '../vertical/dto/breadcrumb.dto';

@ApiTags('weeks')
@ApiBearerAuth('bearer')
@Controller('weeks')
@UseGuards(AdminGuard)
export class WeekController {
  constructor(private readonly weekService: WeekService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new week',
    description:
      'Create a new week within a module. Only accessible by admin users.',
  })
  @ApiBody({
    type: CreateWeekDto,
    description: 'Week creation data',
    examples: {
      example1: {
        summary: 'Week 1 - Introduction',
        description: 'Example of creating the first week of a module',
        value: {
          name: 'Introduction to Programming',
          description: 'Basic programming concepts and setup',
          weekNumber: 1,
          moduleId: 'clxxxxx',
          isActive: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Week successfully created',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clxxxxx' },
        name: { type: 'string', example: 'Introduction to Programming' },
        description: {
          type: 'string',
          example: 'Basic programming concepts and setup',
        },
        weekNumber: { type: 'number', example: 1 },
        moduleId: { type: 'string', example: 'clxxxxx' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  create(@Body() createWeekDto: CreateWeekDto) {
    return this.weekService.create(createWeekDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all weeks',
    description: 'Retrieve a list of all weeks in the LMS system.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of weeks retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'clxxxxx' },
          name: { type: 'string', example: 'Introduction to Programming' },
          description: {
            type: 'string',
            example: 'Basic programming concepts and setup',
          },
          weekNumber: { type: 'number', example: 1 },
          moduleId: { type: 'string', example: 'clxxxxx' },
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
    return this.weekService.findAll();
  }

  @Get('module/:moduleId')
  @ApiOperation({
    summary: 'Get weeks by module',
    description: 'Retrieve all weeks belonging to a specific module.',
  })
  @ApiParam({
    name: 'moduleId',
    description: 'Module ID',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'List of weeks for the module retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'clxxxxx' },
          name: { type: 'string', example: 'Introduction to Programming' },
          description: {
            type: 'string',
            example: 'Basic programming concepts and setup',
          },
          weekNumber: { type: 'number', example: 1 },
          moduleId: { type: 'string', example: 'clxxxxx' },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Module not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  findByModule(@Param('moduleId') moduleId: string) {
    return this.weekService.findByModule(moduleId);
  }

  @Get(':id/breadcrumb')
  @ApiOperation({ summary: 'Get breadcrumb navigation for a week' })
  @ApiParam({ name: 'id', description: 'Week ID' })
  @ApiResponse({
    status: 200,
    description: 'Breadcrumb retrieved successfully',
  })
  async getBreadcrumb(@Param('id') id: string): Promise<BreadcrumbResponse> {
    return this.weekService.getBreadcrumb(id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get week by ID',
    description: 'Retrieve a specific week by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Week ID',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Week retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clxxxxx' },
        name: { type: 'string', example: 'Introduction to Programming' },
        description: {
          type: 'string',
          example: 'Basic programming concepts and setup',
        },
        weekNumber: { type: 'number', example: 1 },
        moduleId: { type: 'string', example: 'clxxxxx' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Week not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  findOne(@Param('id') id: string) {
    return this.weekService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update week',
    description: 'Update an existing week by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Week ID',
    example: 'clxxxxx',
  })
  @ApiBody({
    type: UpdateWeekDto,
    description: 'Week update data',
    examples: {
      example1: {
        summary: 'Update week name',
        description: 'Example of updating week name',
        value: {
          name: 'Advanced Programming Concepts',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Week updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clxxxxx' },
        name: { type: 'string', example: 'Advanced Programming Concepts' },
        description: {
          type: 'string',
          example: 'Basic programming concepts and setup',
        },
        weekNumber: { type: 'number', example: 1 },
        moduleId: { type: 'string', example: 'clxxxxx' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Week not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  update(@Param('id') id: string, @Body() updateWeekDto: UpdateWeekDto) {
    return this.weekService.update(id, updateWeekDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete week',
    description: 'Delete an existing week by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Week ID',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Week deleted successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clxxxxx' },
        name: { type: 'string', example: 'Introduction to Programming' },
        description: {
          type: 'string',
          example: 'Basic programming concepts and setup',
        },
        weekNumber: { type: 'number', example: 1 },
        moduleId: { type: 'string', example: 'clxxxxx' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Week not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  remove(@Param('id') id: string) {
    return this.weekService.remove(id);
  }
}

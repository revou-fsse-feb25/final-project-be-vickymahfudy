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
import { ModuleService } from './module.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { AdminGuard } from '../auth/guards/admin.guard';
import { BreadcrumbResponse } from '../vertical/dto/breadcrumb.dto';

@ApiTags('modules')
@ApiBearerAuth('bearer')
@Controller('modules')
@UseGuards(AdminGuard)
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new module',
    description:
      'Create a new module within a batch. Only accessible by admin users.',
  })
  @ApiBody({
    type: CreateModuleDto,
    description: 'Module creation data',
    examples: {
      example1: {
        summary: 'Frontend Development Module',
        description: 'Example of creating a frontend development module',
        value: {
          name: 'Frontend Development',
          description: 'Learn HTML, CSS, and JavaScript fundamentals',
          moduleOrder: 1,
          batchId: 'clxxxxx',
          isActive: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Module successfully created',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clxxxxx' },
        name: { type: 'string', example: 'Frontend Development' },
        description: {
          type: 'string',
          example: 'Learn HTML, CSS, and JavaScript fundamentals',
        },
        moduleOrder: { type: 'number', example: 1 },
        batchId: { type: 'string', example: 'clxxxxx' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  create(@Body() createModuleDto: CreateModuleDto) {
    return this.moduleService.create(createModuleDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all modules',
    description: 'Retrieve a list of all modules in the LMS system.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of modules retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'clxxxxx' },
          name: { type: 'string', example: 'Frontend Development' },
          description: {
            type: 'string',
            example: 'Learn HTML, CSS, and JavaScript fundamentals',
          },
          moduleOrder: { type: 'number', example: 1 },
          batchId: { type: 'string', example: 'clxxxxx' },
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
    return this.moduleService.findAll();
  }

  @Get('batch/:batchId')
  @ApiOperation({
    summary: 'Get modules by batch',
    description: 'Retrieve all modules belonging to a specific batch.',
  })
  @ApiParam({
    name: 'batchId',
    description: 'Batch ID',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'List of modules for the batch retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'clxxxxx' },
          name: { type: 'string', example: 'Frontend Development' },
          description: {
            type: 'string',
            example: 'Learn HTML, CSS, and JavaScript fundamentals',
          },
          moduleOrder: { type: 'number', example: 1 },
          batchId: { type: 'string', example: 'clxxxxx' },
          isActive: { type: 'boolean', example: true },
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
    return this.moduleService.findByBatch(batchId);
  }

  @Get(':id/breadcrumb')
  @ApiOperation({ summary: 'Get breadcrumb navigation for a module' })
  @ApiParam({ name: 'id', description: 'Module ID' })
  @ApiResponse({
    status: 200,
    description: 'Breadcrumb retrieved successfully',
  })
  async getBreadcrumb(@Param('id') id: string): Promise<BreadcrumbResponse> {
    return this.moduleService.getBreadcrumb(id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get module by ID',
    description: 'Retrieve a specific module by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Module ID',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Module retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clxxxxx' },
        name: { type: 'string', example: 'Frontend Development' },
        description: {
          type: 'string',
          example: 'Learn HTML, CSS, and JavaScript fundamentals',
        },
        moduleOrder: { type: 'number', example: 1 },
        batchId: { type: 'string', example: 'clxxxxx' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Module not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  findOne(@Param('id') id: string) {
    return this.moduleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update module',
    description: 'Update an existing module by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Module ID',
    example: 'clxxxxx',
  })
  @ApiBody({
    type: UpdateModuleDto,
    description: 'Module update data',
    examples: {
      example1: {
        summary: 'Update module name',
        description: 'Example of updating module name',
        value: {
          name: 'Advanced Frontend Development',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Module updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clxxxxx' },
        name: { type: 'string', example: 'Advanced Frontend Development' },
        description: {
          type: 'string',
          example: 'Learn HTML, CSS, and JavaScript fundamentals',
        },
        moduleOrder: { type: 'number', example: 1 },
        batchId: { type: 'string', example: 'clxxxxx' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Module not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  update(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDto) {
    return this.moduleService.update(id, updateModuleDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete module',
    description: 'Delete an existing module by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Module ID',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Module deleted successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clxxxxx' },
        name: { type: 'string', example: 'Frontend Development' },
        description: {
          type: 'string',
          example: 'Learn HTML, CSS, and JavaScript fundamentals',
        },
        moduleOrder: { type: 'number', example: 1 },
        batchId: { type: 'string', example: 'clxxxxx' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Module not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  remove(@Param('id') id: string) {
    return this.moduleService.remove(id);
  }
}

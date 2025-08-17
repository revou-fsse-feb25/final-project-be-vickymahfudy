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
} from '@nestjs/swagger';
import { BatchService } from './batch.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { AdminGuard } from '../auth/guards/admin.guard';
import { BreadcrumbResponse } from '../vertical/dto/breadcrumb.dto';

@ApiTags('batches')
@ApiBearerAuth('bearer')
@Controller('batches')
@UseGuards(AdminGuard)
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new batch',
    description:
      'Create a new batch within a vertical. Only accessible by admin users.',
  })
  @ApiBody({
    type: CreateBatchDto,
    description: 'Batch creation data',
    examples: {
      example1: {
        summary: 'Software Engineering Batch',
        description:
          'Example of creating a batch for Software Engineering vertical',
        value: {
          name: 'Oct25',
          description: 'October 2025 Software Engineering Batch',
          verticalId: 'clxxxxx',
          startDate: '2025-10-01T00:00:00.000Z',
          endDate: '2026-04-01T00:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Batch successfully created',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clxxxxx' },
        name: { type: 'string', example: 'Oct25' },
        description: {
          type: 'string',
          example: 'October 2025 Software Engineering Batch',
        },
        verticalId: { type: 'string', example: 'clxxxxx' },
        startDate: { type: 'string', example: '2024-02-01T00:00:00.000Z' },
        endDate: { type: 'string', example: '2024-08-01T00:00:00.000Z' },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  create(@Body() createBatchDto: CreateBatchDto) {
    return this.batchService.create(createBatchDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all batches',
    description:
      'Retrieve a list of all batches in the LMS system with optional search and filtering.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of batches retrieved successfully',
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
          verticalId: { type: 'string', example: 'clxxxxx' },
          startDate: { type: 'string', example: '2024-02-01T00:00:00.000Z' },
          endDate: { type: 'string', example: '2024-08-01T00:00:00.000Z' },
          createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  findAll(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('verticalId') verticalId?: string,
  ) {
    return this.batchService.findAll({ search, status, verticalId });
  }

  @Get('vertical/:verticalId')
  @ApiOperation({
    summary: 'Get batches by vertical',
    description: 'Retrieve all batches belonging to a specific vertical.',
  })
  @ApiParam({
    name: 'verticalId',
    description: 'Vertical ID',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'List of batches for the vertical retrieved successfully',
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
          verticalId: { type: 'string', example: 'clxxxxx' },
          startDate: { type: 'string', example: '2024-02-01T00:00:00.000Z' },
          endDate: { type: 'string', example: '2024-08-01T00:00:00.000Z' },
          createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Vertical not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  findByVertical(@Param('verticalId') verticalId: string) {
    return this.batchService.findByVertical(verticalId);
  }

  @Get(':id/breadcrumb')
  @ApiOperation({ summary: 'Get breadcrumb navigation for a batch' })
  @ApiParam({ name: 'id', description: 'Batch ID' })
  @ApiResponse({
    status: 200,
    description: 'Breadcrumb retrieved successfully',
  })
  async getBreadcrumb(@Param('id') id: string): Promise<BreadcrumbResponse> {
    return this.batchService.getBreadcrumb(id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get batch by ID',
    description: 'Retrieve a specific batch by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Batch ID',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Batch retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clxxxxx' },
        name: { type: 'string', example: 'Oct25' },
        description: {
          type: 'string',
          example: 'October 2025 Software Engineering Batch',
        },
        verticalId: { type: 'string', example: 'clxxxxx' },
        startDate: { type: 'string', example: '2024-02-01T00:00:00.000Z' },
        endDate: { type: 'string', example: '2024-08-01T00:00:00.000Z' },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Batch not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  findOne(@Param('id') id: string) {
    return this.batchService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update batch',
    description: 'Update an existing batch by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Batch ID',
    example: 'clxxxxx',
  })
  @ApiBody({
    type: UpdateBatchDto,
    description: 'Batch update data',
    examples: {
      example1: {
        summary: 'Update batch name',
        description: 'Example of updating batch name',
        value: {
          name: 'Oct25 - Updated',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Batch updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clxxxxx' },
        name: { type: 'string', example: 'Oct25 - Updated' },
        description: {
          type: 'string',
          example: 'October 2025 Software Engineering Batch - Updated',
        },
        verticalId: { type: 'string', example: 'clxxxxx' },
        startDate: { type: 'string', example: '2024-02-01T00:00:00.000Z' },
        endDate: { type: 'string', example: '2024-08-01T00:00:00.000Z' },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Batch not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  update(@Param('id') id: string, @Body() updateBatchDto: UpdateBatchDto) {
    return this.batchService.update(id, updateBatchDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete batch',
    description: 'Delete an existing batch by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Batch ID',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Batch deleted successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clxxxxx' },
        name: { type: 'string', example: 'Oct25' },
        description: {
          type: 'string',
          example: 'October 2025 Software Engineering Batch',
        },
        verticalId: { type: 'string', example: 'clxxxxx' },
        startDate: { type: 'string', example: '2024-02-01T00:00:00.000Z' },
        endDate: { type: 'string', example: '2024-08-01T00:00:00.000Z' },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Batch not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  remove(@Param('id') id: string) {
    return this.batchService.remove(id);
  }
}

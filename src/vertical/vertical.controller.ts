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
import { VerticalService } from './vertical.service';
import { CreateVerticalDto } from './dto/create-vertical.dto';
import { UpdateVerticalDto } from './dto/update-vertical.dto';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('verticals')
@ApiBearerAuth('bearer')
@Controller('verticals')
@UseGuards(AdminGuard)
export class VerticalController {
  constructor(private readonly verticalService: VerticalService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new vertical',
    description:
      'Create a new vertical in the LMS system. Only accessible by admin users.',
  })
  @ApiBody({
    type: CreateVerticalDto,
    description: 'Vertical creation data',
    examples: {
      example1: {
        summary: 'Data Science Vertical',
        description: 'Example of creating a Data Science vertical',
        value: {
          name: 'Data Science',
          description:
            'Learn data science fundamentals and advanced techniques',
          type: 'DATA_SCIENCE',
        },
      },
      example2: {
        summary: 'Full Stack Vertical',
        description: 'Example of creating a Full Stack vertical',
        value: {
          name: 'Full Stack Development',
          description:
            'Learn full stack development fundamentals and advanced techniques',
          type: 'FULLSTACK',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Vertical successfully created',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clxxxxx' },
        name: { type: 'string', example: 'Software Engineering' },
        description: {
          type: 'string',
          example: 'Learn software engineering fundamentals',
        },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  create(@Body() createVerticalDto: CreateVerticalDto) {
    return this.verticalService.create(createVerticalDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all verticals',
    description:
      'Retrieve a list of all verticals in the LMS system with optional search and filtering.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of verticals retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'clxxxxx' },
          name: { type: 'string', example: 'Software Engineering' },
          description: {
            type: 'string',
            example: 'Learn software engineering fundamentals',
          },
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
    @Query('type') type?: string,
  ) {
    return this.verticalService.findAll({ search, status, type });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get vertical by ID',
    description: 'Retrieve a specific vertical by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Vertical ID',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Vertical retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clxxxxx' },
        name: { type: 'string', example: 'Software Engineering' },
        description: {
          type: 'string',
          example: 'Learn software engineering fundamentals',
        },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Vertical not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  findOne(@Param('id') id: string) {
    return this.verticalService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update vertical',
    description: 'Update an existing vertical by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Vertical ID',
    example: 'clxxxxx',
  })
  @ApiBody({
    type: UpdateVerticalDto,
    description: 'Vertical update data',
    examples: {
      example1: {
        summary: 'Update vertical name',
        description: 'Example of updating vertical name',
        value: {
          name: 'Advanced Software Engineering',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Vertical updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clxxxxx' },
        name: { type: 'string', example: 'Advanced Software Engineering' },
        description: {
          type: 'string',
          example: 'Learn software engineering fundamentals',
        },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Vertical not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  update(
    @Param('id') id: string,
    @Body() updateVerticalDto: UpdateVerticalDto,
  ) {
    return this.verticalService.update(id, updateVerticalDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete vertical',
    description: 'Delete an existing vertical by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Vertical ID',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Vertical deleted successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clxxxxx' },
        name: { type: 'string', example: 'Software Engineering' },
        description: {
          type: 'string',
          example: 'Learn software engineering fundamentals',
        },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Vertical not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  remove(@Param('id') id: string) {
    return this.verticalService.remove(id);
  }

  @Get(':id/breadcrumb')
  @ApiOperation({
    summary: 'Get breadcrumb for vertical',
    description: 'Get breadcrumb navigation data for a specific vertical.',
  })
  @ApiParam({
    name: 'id',
    description: 'Vertical ID',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Breadcrumb data retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Vertical not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  getBreadcrumb(@Param('id') id: string) {
    return this.verticalService.getBreadcrumb(id);
  }
}

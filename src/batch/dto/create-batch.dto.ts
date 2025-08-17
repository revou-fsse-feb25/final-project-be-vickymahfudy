import { IsString, IsOptional, IsDateString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBatchDto {
  @ApiProperty({
    description: 'Name of the batch',
    example: 'Full Stack Development Batch 2024-Q1',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of the batch',
    example:
      'Intensive 12-week full stack development program covering React, Node.js, and databases',
    required: false,
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Start date of the batch',
    example: '2024-01-15T09:00:00.000Z',
    format: 'date-time',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'End date of the batch',
    example: '2024-04-15T17:00:00.000Z',
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: 'ID of the vertical this batch belongs to',
    example: 'clxxxxx',
    format: 'cuid',
  })
  @IsString()
  verticalId: string;

  @ApiProperty({
    description: 'Whether the batch is active',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AssignmentType, AssignmentStatus } from '@prisma/client';

export class CreateAssignmentDto {
  @ApiProperty({
    description: 'Title of the assignment',
    example: 'JavaScript Fundamentals Quiz',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the assignment',
    example:
      'Complete this quiz to test your understanding of JavaScript fundamentals including variables, functions, and control structures',
    required: false,
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Type of assignment',
    enum: AssignmentType,
    example: AssignmentType.QUIZ,
    enumName: 'AssignmentType',
  })
  @IsEnum(AssignmentType)
  type: AssignmentType;

  @ApiProperty({
    description: 'Current status of the assignment',
    enum: AssignmentStatus,
    example: AssignmentStatus.DRAFT,
    enumName: 'AssignmentStatus',
  })
  @IsEnum(AssignmentStatus)
  status: AssignmentStatus;

  @ApiProperty({
    description: 'Maximum score possible for this assignment',
    example: 100,
    minimum: 0,
    maximum: 1000,
  })
  @IsNumber()
  @Min(0)
  @Max(1000)
  maxScore: number;

  @ApiProperty({
    description: 'Due date for assignment submission',
    example: '2024-12-31T23:59:59.000Z',
    format: 'date-time',
  })
  @IsDateString()
  dueDate: string;

  @ApiProperty({
    description: 'Date when assignment will be published to students',
    example: '2024-12-01T09:00:00.000Z',
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @ApiProperty({
    description: 'ID of the batch this assignment belongs to',
    example: 'clxxxxx',
    format: 'cuid',
  })
  @IsString()
  batchId: string;
}

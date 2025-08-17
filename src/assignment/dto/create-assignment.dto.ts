import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { AssignmentType, AssignmentStatus } from '@prisma/client';

export class CreateAssignmentDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(AssignmentType)
  type: AssignmentType;

  @IsEnum(AssignmentStatus)
  status: AssignmentStatus;

  @IsNumber()
  @Min(0)
  @Max(1000)
  maxScore: number;

  @IsDateString()
  dueDate: string;

  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @IsString()
  batchId: string;
}
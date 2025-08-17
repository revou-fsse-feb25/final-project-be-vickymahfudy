import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsEnum,
} from 'class-validator';
import { SubmissionType } from '@prisma/client';

export class CreateSubmissionDto {
  @ApiProperty({
    description: 'Type of submission',
    enum: SubmissionType,
    example: 'LINK',
  })
  @IsEnum(SubmissionType)
  @IsNotEmpty()
  type: SubmissionType;

  @ApiProperty({
    description: 'URL of the submission link',
    example: 'https://github.com/username/project',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  linkUrl?: string;

  @ApiProperty({
    description: 'Title of the submission link',
    example: 'My Project Repository',
    required: false,
  })
  @IsOptional()
  @IsString()
  linkTitle?: string;

  @ApiProperty({
    description: 'Additional content or description',
    example: 'This is my final project submission',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'Assignment ID',
    example: 'clxxxxx',
  })
  @IsString()
  @IsNotEmpty()
  assignmentId: string;
}

import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VerticalType } from '@prisma/client';

export class CreateVerticalDto {
  @ApiProperty({
    description: 'Name of the vertical',
    example: 'Full Stack Development',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of the vertical',
    example:
      'Comprehensive full stack development program covering frontend and backend technologies',
    required: false,
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Type of the vertical',
    enum: VerticalType,
    example: VerticalType.FULLSTACK,
    enumName: 'VerticalType',
  })
  @IsEnum(VerticalType)
  type: VerticalType;

  @ApiProperty({
    description: 'Whether the vertical is active',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

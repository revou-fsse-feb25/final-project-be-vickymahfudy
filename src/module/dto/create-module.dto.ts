import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateModuleDto {
  @ApiProperty({
    description: 'Name of the module',
    example: 'Frontend Development',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of the module',
    example:
      'Learn HTML, CSS, and JavaScript fundamentals for building modern web applications',
    required: false,
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Order of the module within the batch',
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  moduleOrder: number;

  @ApiProperty({
    description: 'ID of the batch this module belongs to',
    example: 'clxxxxx',
    format: 'cuid',
  })
  @IsString()
  batchId: string;

  @ApiProperty({
    description: 'Whether the module is active',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

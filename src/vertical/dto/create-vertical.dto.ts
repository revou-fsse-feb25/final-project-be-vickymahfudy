import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { VerticalType } from '@prisma/client';

export class CreateVerticalDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(VerticalType)
  type: VerticalType;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
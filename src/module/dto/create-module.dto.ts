import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateModuleDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  moduleOrder: number;

  @IsString()
  batchId: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
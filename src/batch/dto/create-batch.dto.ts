import { IsString, IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class CreateBatchDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsString()
  verticalId: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
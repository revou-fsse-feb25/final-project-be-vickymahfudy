import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateWeekDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  weekNumber: number;

  @IsString()
  moduleId: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
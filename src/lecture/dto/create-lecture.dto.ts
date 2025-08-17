import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateLectureDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  zoomLink?: string;

  @IsOptional()
  @IsString()
  deckLink?: string;

  @IsNumber()
  lectureNumber: number;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }: { value: string | null }) => {
    return value === null || value === '' ? undefined : value;
  })
  scheduledAt?: string;

  @IsString()
  weekId: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
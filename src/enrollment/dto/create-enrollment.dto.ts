import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEnrollmentDto {
  @ApiProperty({
    description: 'Batch ID to enroll in',
    example: 'clxxxxx',
  })
  @IsString()
  @IsNotEmpty()
  batchId: string;
}

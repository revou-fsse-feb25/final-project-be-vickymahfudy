import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl } from 'class-validator';

export class UpdateSubmissionDto {
  @ApiProperty({
    description: 'URL of the submission link',
    example: 'https://github.com/username/updated-project',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  linkUrl?: string;

  @ApiProperty({
    description: 'Title of the submission link',
    example: 'My Updated Project Repository',
    required: false,
  })
  @IsOptional()
  @IsString()
  linkTitle?: string;

  @ApiProperty({
    description: 'Additional content or description',
    example: 'Updated submission with improvements',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;
}

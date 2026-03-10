import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({
    example: 'nestjs',
    description: 'Name of the tag',
  })
  name: string;
}

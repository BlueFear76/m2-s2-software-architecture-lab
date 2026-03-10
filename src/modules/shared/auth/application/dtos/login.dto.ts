import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({
    example: 'johndoe',
    description: 'Username of the user',
  })
  username: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password',
  })
  password: string;
}

import { ApiProperty } from '@nestjs/swagger';
import type { UserRole } from '../../domain/entities/user.entity';

export class CreateUserDto {
  @ApiProperty({
    example: 'johndoe',
    description: 'Unique username of the user',
  })
  username: string;

  @ApiProperty({
    example: 'admin',
    description: 'Role assigned to the user',
    enum: ['admin', 'user', 'moderator', 'writer'],
  })
  role: UserRole;

  @ApiProperty({
    example: 'password123',
    description: 'User password',
  })
  password: string;
}

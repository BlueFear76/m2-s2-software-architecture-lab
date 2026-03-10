import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import { ListUsersUseCase } from '../../application/use-cases/list-users.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) {}

  @ApiOperation({ summary: 'List all users' })
  @ApiResponse({ status: 200, description: 'List of users returned successfully' })
  @Get()
  public async listUsers() {
    const users = await this.listUsersUseCase.execute();
    return users.map((u) => u.toJSON());
  }

   @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':id')
  public async getUserById(@Param('id') id: string) {
    const user = await this.getUserByIdUseCase.execute(id);
    return user?.toJSON();
  }

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @Post()
  public async createUser(@Body() input: CreateUserDto) {
    return this.createUserUseCase.execute(input);
  }

  @ApiOperation({ summary: 'Update an existing user' })
  @ApiResponse({ status: 200, description: 'User successfully updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Patch(':id')
  public async updateUser(
    @Param('id') id: string,
    @Body() input: UpdateUserDto,
  ) {
    return this.updateUserUseCase.execute(id, input);
  }

   @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User successfully deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Delete(':id')
  public async deleteUser(@Param('id') id: string) {
    return this.deleteUserUseCase.execute(id);
  }
}

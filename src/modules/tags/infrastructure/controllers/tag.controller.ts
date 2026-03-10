import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Requester } from '../../../shared/auth/infrastructure/decorators/requester.decorator';
import { JwtAuthGuard } from '../../../shared/auth/infrastructure/guards/jwt-auth.guard';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { CreateTagDto } from '../../application/dtos/create-tag.dto';
import { UpdateTagDto } from '../../application/dtos/update-tag.dto';
import { CreateTagUseCase } from '../../application/use-cases/create-tag.use-case';
import { DeleteTagUseCase } from '../../application/use-cases/delete-tag.use-case';
import { GetTagByNameUseCase } from '../../application/use-cases/get-tag-by-name.use-case';
import { GetTagByIdUseCase } from '../../application/use-cases/get-tag-by-id.use-case';
import { GetTagsUseCase } from '../../application/use-cases/get-tags.use-case';
import { UpdateTagUseCase } from '../../application/use-cases/update-tag.use-case';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('tags')
@Controller('tags')
export class TagController {
  constructor(
    private readonly createTagUseCase: CreateTagUseCase,
    private readonly updateTagUseCase: UpdateTagUseCase,
    private readonly deleteTagUseCase: DeleteTagUseCase,
    private readonly getTagsUseCase: GetTagsUseCase,
    private readonly getTagByIdUseCase: GetTagByIdUseCase,
    private readonly getTagByNameUseCase: GetTagByNameUseCase,
  ) { }

  @ApiOperation({ summary: 'Get all tags or filter by name' })
  @ApiQuery({ name: 'name', required: false, description: 'Filter tag by name' })
  @ApiResponse({ status: 200, description: 'List of tags' })
  @Get()
  public async getTags(@Query('name') name?: string) {
    if (name) {
      const tag = await this.getTagByNameUseCase.execute(name);
      return tag?.toJSON();
    }

    const tags = await this.getTagsUseCase.execute();
    return tags.map((t) => t.toJSON());
  }

  @ApiOperation({ summary: 'Get tag by id' })
  @ApiResponse({ status: 200, description: 'Tag found' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  @Get(':id')
  public async getTagById(
    @Param('id') id: string,
  ) {
    const tag = await this.getTagByIdUseCase.execute(id);

    return tag?.toJSON();
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiResponse({ status: 201, description: 'Tag created' })
  @UseGuards(JwtAuthGuard)
  @Post()
  public async createTag(
    @Requester() user: UserEntity,
    @Body() input: CreateTagDto,
  ) {
    return this.createTagUseCase.execute(input, user);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a tag' })
  @ApiResponse({ status: 200, description: 'Tag updated' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  public async updateTag(
    @Param('id') id: string,
    @Body() input: UpdateTagDto,
  ) {
    return this.updateTagUseCase.execute(id, input);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a tag' })
  @ApiResponse({ status: 200, description: 'Tag deleted' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  public async deleteTag(@Param('id') id: string) {
    return this.deleteTagUseCase.execute(id);
  }
}

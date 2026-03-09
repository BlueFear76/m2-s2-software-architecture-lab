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

  @Get()
  public async getTags(@Query('name') name?: string) {
    if (name) {
      const tag = await this.getTagByNameUseCase.execute(name);
      return tag?.toJSON();
    }

    const tags = await this.getTagsUseCase.execute();
    return tags.map((t) => t.toJSON());
  }

  @Get(':id')
  public async getTagById(
    @Param('id') id: string,
  ) {
    const tag = await this.getTagByIdUseCase.execute(id);

    return tag?.toJSON();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  public async createTag(
    @Requester() user: UserEntity,
    @Body() input: CreateTagDto,
  ) {
    return this.createTagUseCase.execute(input, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  public async updateTag(
    @Param('id') id: string,
    @Body() input: UpdateTagDto,
  ) {
    return this.updateTagUseCase.execute(id, input);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  public async deleteTag(@Param('id') id: string) {
    return this.deleteTagUseCase.execute(id);
  }
}

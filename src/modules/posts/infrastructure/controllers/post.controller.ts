import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Requester } from '../../../shared/auth/infrastructure/decorators/requester.decorator';
import { JwtAuthGuard } from '../../../shared/auth/infrastructure/guards/jwt-auth.guard';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { CreatePostDto } from '../../application/dtos/create-post.dto';
import { UpdatePostDto } from '../../application/dtos/update-post.dto';
import { CreatePostUseCase } from '../../application/use-cases/create-post.use-case';
import { DeletePostUseCase } from '../../application/use-cases/delete-post.use-case';
import { GetPostByIdUseCase } from '../../application/use-cases/get-post-by-id.use-case';
import { GetPostsUseCase } from '../../application/use-cases/get-posts.use-case';
import { UpdatePostUseCase } from '../../application/use-cases/update-post.use-case';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddTagToPostUseCase } from '../../application/use-cases/add-tag-to-post.use-case';
import { DeleteTagFromPostUseCase } from '../../application/use-cases/delete-tag-from-post.use-case';
import { OptionalJwtAuthGuard } from 'src/modules/shared/auth/infrastructure/guards/optional-jwt-auth.guard';
import { GetPostBySlugUseCase } from '../../application/use-cases/get-post-by-slug.use-case';


@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly updatePostUseCase: UpdatePostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
    private readonly getPostsUseCase: GetPostsUseCase,
    private readonly getPostByIdUseCase: GetPostByIdUseCase,
    private readonly addTagToPostUseCase: AddTagToPostUseCase,
    private readonly deleteTagFromPostUseCase: DeleteTagFromPostUseCase,
    private readonly getPostBySlugUseCase: GetPostBySlugUseCase,
  ) { }

  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'Return all posts.' })
  @Get()
  @ApiBearerAuth('access-token') // <--- Indispensable pour Swagger !
  @UseGuards(OptionalJwtAuthGuard)
  public async getPosts(
    @Requester() user: UserEntity,
  ) {
    const posts = await this.getPostsUseCase.execute(user);

    return posts.map((p) => p.toJSON());
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiResponse({ status: 200, description: 'The post has been successfully retrieved.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async getPostById(
    @Requester() user: UserEntity,
    @Param('id') id: string,
  ) {
    const post = await this.getPostByIdUseCase.execute(id, user);

    return post?.toJSON();
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new post' })
  @Post()
  @UseGuards(JwtAuthGuard)
  public async createPost(
    @Requester() user: UserEntity,
    @Body() input: CreatePostDto,
  ) {
    return this.createPostUseCase.execute(
      { ...input },
      user,
    );
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Add a tag to a post' })
  @ApiResponse({ status: 200, description: 'Tag added successfully' })
  @UseGuards(JwtAuthGuard)
  @Post(':postId/tags/:tagId') // URL : /posts/ID_DU_POST/tags/ID_DU_TAG
  public async addTag(
    @Requester() user: UserEntity,
    @Param('postId') postId: string,
    @Param('tagId') tagId: string,
  ) {
    const post = await this.addTagToPostUseCase.execute(postId, tagId, user);
    return post!.toJSON();
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Remove a tag from a post' })
  @ApiResponse({ status: 200, description: 'Tag removed successfully' })
  @UseGuards(JwtAuthGuard)
  @Delete(':postId/tags/:tagId') // On utilise DELETE pour la suppression
  public async removeTag(
    @Requester() user: UserEntity,
    @Param('postId') postId: string,
    @Param('tagId') tagId: string,
  ) {
    const post = await this.deleteTagFromPostUseCase.execute(postId, tagId, user);
    return post!.toJSON();
  }


  @ApiOperation({ summary: 'Update a post' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  public async updatePost(
    @Requester() user: UserEntity,
    @Param('id') id: string,
    @Body() input: UpdatePostDto,
  ) {
    return this.updatePostUseCase.execute(id, input, user);
  }



  @ApiOperation({ summary: 'Delete a post' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  public async deletePost(@Param('id') id: string) {
    return this.deletePostUseCase.execute(id);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get a post by Slug' })
  @Get('slug/:slug')
  @UseGuards(OptionalJwtAuthGuard)
  public async getPostBySlug(
    @Requester() user: UserEntity | undefined,
    @Param('slug') slug: string,
  ) {
    const post = await this.getPostBySlugUseCase.execute(slug, user);
    return post.toJSON();
  }
}

import { 
  Controller, Post, Body, Param, UseGuards, 
  Get, Patch, Delete, HttpCode, HttpStatus 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/shared/auth/infrastructure/guards/jwt-auth.guard';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { CreateCommentUseCase } from '../../application/use-cases/create-comment.use-case';
import { CreateCommentDto } from '../../application/dtos/create-comment.dto';
import { Requester } from 'src/modules/shared/auth/infrastructure/decorators/requester.decorator';
import { UpdateCommentDto } from '../../application/dtos/update-comment.dto';
import { UpdateCommentUseCase } from '../../application/use-cases/update-comment.use-case';

@ApiTags('Comments')
@Controller()
export class CommentController {
  constructor(
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly updateCommentUseCase: UpdateCommentUseCase,
  ) {}

  @ApiOperation({ summary: 'Create a comment on a post' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('posts/:postId/comments')
  public async createComment(
    @Param('postId') postId: string,
    @Body() dto: CreateCommentDto,
    @Requester() user: UserEntity,
  ) {
    const comment = await this.createCommentUseCase.execute(
      postId, 
      dto.content, 
      user
    );
    
    return comment.toJSON();
  }

  @ApiOperation({ summary: 'Update a comment' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch('comments/:id') // Route conforme au contrat
  public async updateComment(
    @Param('id') id: string,
    @Body() dto: UpdateCommentDto,
    @Requester() user: UserEntity,
  ) {
    const comment = await this.updateCommentUseCase.execute(
      id, 
      dto.content, 
      user
    );
    
    return comment.toJSON();
  }
}
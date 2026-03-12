import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CommentRepository } from '../../domain/repositories/comment.repository';
import { CommentEntity } from '../../domain/entities/comment.entity';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { CommentPermissions } from '../../domain/permissions/comment.permissions';

@Injectable()
export class UpdateCommentUseCase {
  constructor(private readonly commentRepository: CommentRepository) {}

  public async execute(
    commentId: string,
    newContent: string,
    user: UserEntity,
  ): Promise<CommentEntity> {

    const comment = await this.commentRepository.findById(commentId);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const permissions = new CommentPermissions(user, comment);
    if (!permissions.canUpdate()) {
      throw new ForbiddenException('You are not allowed to update this comment');
    }


    comment.updateContent(newContent);

    
    await this.commentRepository.save(comment);

    return comment;
  }
}
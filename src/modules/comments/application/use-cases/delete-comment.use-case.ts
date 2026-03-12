import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CommentRepository } from '../../domain/repositories/comment.repository';
import { PostRepository } from '../../../posts/domain/repositories/post.repository';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { CommentPermissions } from '../../domain/permissions/comment.permissions';

@Injectable()
export class DeleteCommentUseCase {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository, // Besoin de vérifier l'auteur du post
  ) {}

  public async execute(commentId: string, user: UserEntity): Promise<void> {
    // 1. Récupérer le commentaire
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // 2. Récupérer le post pour avoir le postAuthorId
    const post = await this.postRepository.getPostById(comment.postId);
    
    // 3. Vérifier les permissions
    const permissions = new CommentPermissions(user, comment, post?.authorId);
    
    if (!permissions.canDelete()) {
      throw new ForbiddenException('You are not allowed to delete this comment');
    }

    // 4. Suppression
    await this.commentRepository.delete(commentId);
  }
}
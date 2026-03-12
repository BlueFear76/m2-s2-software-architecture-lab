import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from '../../../posts/domain/repositories/post.repository';
import { CommentRepository } from '../../domain/repositories/comment.repository';
import { CommentEntity } from '../../domain/entities/comment.entity';
import { UserEntity } from '../../../users/domain/entities/user.entity';

@Injectable()
export class CreateCommentUseCase {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository,
    // private readonly notificationService: NotificationService
  ) {}

  public async execute(
    postId: string,
    content: string,
    user: UserEntity,
  ): Promise<CommentEntity> {

    const post = await this.postRepository.getPostById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.status !== 'accepted') {
      throw new ForbiddenException('You can only comment on accepted posts');
    }

    const comment = CommentEntity.create(content, user.id, postId);

    await this.commentRepository.save(comment);

    //TODO: Notification ("User X commented on your post 'Title'")
    // this.notificationService.notifyComment(post.authorId, user.username, post.title);

    return comment;
  }
}
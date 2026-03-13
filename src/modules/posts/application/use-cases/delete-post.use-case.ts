import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { PostRepository } from '../../domain/repositories/post.repository';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class DeletePostUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly loggingService: LoggingService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async execute(id: string, user: UserEntity): Promise<void> {
    this.loggingService.log('DeletePostUseCase.execute');

    const post = await this.postRepository.getPostById(id);

    if (!post) throw new NotFoundException('Post not found');

    // Vérification des permissions (Admin ou Modérateur)
    if (!user.permissions.posts.canDeletePost(post)) {
        throw new ForbiddenException("You cannot delete this post");
    }

    this.eventEmitter.emit('post.deleted', {
        postId: post.id,
        authorId: post.authorId,
        title: post.title.toString(),
    });

    await this.postRepository.deletePost(id);
  }
}

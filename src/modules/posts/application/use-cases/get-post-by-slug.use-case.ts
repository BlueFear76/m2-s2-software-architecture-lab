import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostRepository } from '../../domain/repositories/post.repository';

@Injectable()
export class GetPostBySlugUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly loggingService: LoggingService,
  ) {}

  public async execute(
    slug: string,
    user?: UserEntity,
  ): Promise<PostEntity> {
    this.loggingService.log('GetPostBySlugUseCase.execute');

    const post = await this.postRepository.findBySlug(slug);

    if (!post) {
      throw new NotFoundException(`This post doesn't exist`);
    }

    if (user) {
      if (!user.permissions.posts.canReadPost(post)) {
        throw new ForbiddenException('Cannot read this post');
      }
    } else {
      if (post.status !== 'accepted') {
        throw new ForbiddenException('Cannot read this post');
      }
    }

    return post;
  }
}
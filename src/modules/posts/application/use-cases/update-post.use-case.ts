import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { PostRepository } from '../../domain/repositories/post.repository';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';

@Injectable()
export class UpdatePostUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly loggingService: LoggingService,
  ) { }

  public async execute(id: string, input: UpdatePostDto, user: UserEntity): Promise<void> {
    this.loggingService.log('UpdatePostUseCase.execute');
    const post = await this.postRepository.getPostById(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (!user.permissions.posts.canUpdateContent(post)) {
      throw new ForbiddenException("You are not allowed to update this post");
    }

    if (input.slug) {
      const existingPost = await this.postRepository.findBySlug(input.slug);

      if (existingPost && existingPost.id !== id) {
        throw new ConflictException('This slug is already taken by another post');
      }
      
      post.updateSlug(input.slug);
    }

    post.update(input.title, input.content);
    await this.postRepository.updatePost(id, post);
  }
}

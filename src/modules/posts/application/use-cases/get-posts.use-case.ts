import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostRepository } from '../../domain/repositories/post.repository';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';

@Injectable()
export class GetPostsUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly loggingService: LoggingService,
  ) {}

  public async execute(user?: UserEntity): Promise<PostEntity[]> {
    this.loggingService.log('GetPostsUseCase.execute');
    
    const allPosts = await this.postRepository.getPosts();
    this.loggingService.log(`Total posts found in DB: ${allPosts.length}`);

    if (!user) {
      this.loggingService.log('No user provided, filtering for accepted posts only');
      return allPosts.filter((post) => post.status === 'accepted');
    }

    this.loggingService.log(`Checking permissions for User: ${user.id} (Role: ${user.role})`);

    const filtered = allPosts.filter((post) => {
      const canRead = user.permissions.posts.canReadPost(post);
      
      // On logue chaque décision pour comprendre pourquoi un draft est sauté
      this.loggingService.log(
        `Post ${post.id} | Status: ${post.status} | Author: ${post.authorId} | CanRead: ${canRead}`
      );
      
      return canRead;
    });

    this.loggingService.log(`Returning ${filtered.length} posts after filtering`);
    return filtered;
  }
}

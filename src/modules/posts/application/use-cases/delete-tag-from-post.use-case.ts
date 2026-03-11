import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PostRepository } from '../../domain/repositories/post.repository';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { PostEntity } from '../../domain/entities/post.entity';

@Injectable()
export class DeleteTagFromPostUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  public async execute(
    postId: string,
    tagId: string,
    user: UserEntity,
  ): Promise<PostEntity> {

    const post = await this.postRepository.getPostById(postId);

    if (!post) {
      throw new NotFoundException('Post non trouvé');
    }

    const tagExists = post.tags.some(t => t.id === tagId);
    if (!tagExists) {
      throw new NotFoundException("Ce tag n'est pas associé à ce post");
    }

    post.removeTag(tagId);
    
    await this.postRepository.updatePost(postId, post);

    return post;
  }
}
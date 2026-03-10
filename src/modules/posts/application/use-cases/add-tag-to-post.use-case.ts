import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PostRepository } from '../../domain/repositories/post.repository';
import { TagRepository } from '../../../tags/domain/repositories/tag.repository';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';

@Injectable()
export class AddTagToPostUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly tagRepository: TagRepository,
  ) {}

  async execute(postId: string, tagId: string, user: UserEntity): Promise<void> {

    const post = await this.postRepository.getPostById(postId);
    if (!post) throw new NotFoundException('Post non trouvé');


    if (post.authorId !== currentUserId && !isAdmin) {
      throw new ForbiddenException("Vous n'avez pas le droit de modifier ce post");
    }


    const tag = await this.tagRepository.getTagById(tagId);
    if (!tag) throw new NotFoundException('Tag non trouvé');

    post.addTag(tag);

    await this.postRepository.updatePost(postId , post);

    return post.toJSON();
  }
}
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostCreatedEvent } from '../../domain/events/post-created.event';
import { UserCannotCreatePostException } from '../../domain/exceptions/user-cannot-create-post.exception';
import { PostRepository } from '../../domain/repositories/post.repository';
import { CreatePostDto } from '../dtos/create-post.dto';
import { PostSlug } from '../../domain/value-objects/post-slug.value-object';


@Injectable()
export class CreatePostUseCase {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly postRepository: PostRepository,
  ) { }

  public async execute(input: CreatePostDto, user: UserEntity): Promise<void> {
    if (!user.permissions.posts.canCreate()) {
      throw new UserCannotCreatePostException();
    }

    const baseSlugValue = input.slug
      ? PostSlug.fromTitle(input.slug)
      : PostSlug.fromTitle(input.title);

    let finalSlug = baseSlugValue;
    let counter = 2;

    while (await this.postRepository.findBySlug(finalSlug)) {
      finalSlug = `${baseSlugValue}-${counter}`;
      counter++;
    }

    const post = PostEntity.create(
      input.title,
      input.content,
      user.id,
      finalSlug
    );

    await this.postRepository.createPost(post);

    this.eventEmitter.emit('post.pending_review', {
      postId: post.id,
      title: post.title.toString(),
      link: post.slug
    });
  }
}

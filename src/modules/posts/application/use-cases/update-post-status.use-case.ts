import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PostRepository } from '../../domain/repositories/post.repository';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { PostStatus } from '../../domain/entities/post.entity';
import { LoggingService } from 'src/modules/shared/logging/domain/services/logging.service';
import { UserRepository } from 'src/modules/users/domain/repositories/user.repository';

@Injectable()
export class UpdatePostStatusUseCase {
    constructor(
        private readonly postRepository: PostRepository,
        private readonly eventEmitter: EventEmitter2,
        private readonly loggingService: LoggingService,
        private readonly userRepository: UserRepository,

    ) { }

    public async execute(id: string, newStatus: PostStatus, user: UserEntity): Promise<void> {
        this.loggingService.log('UpdatePostStatusUseCase.execute');
        const post = await this.postRepository.getPostById(id);

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        if (!user.permissions.posts.canModerate()) {
            throw new ForbiddenException("You are not allowed to moderate this post");
        }

        const author = await this.userRepository.getUserById(post.authorId);
        const authorName = author ? author.username : 'An author';

        post.updateStatus(newStatus)

        await this.postRepository.updatePost(id, post);
        this.loggingService.log(post.id);
        this.loggingService.log(post.authorId);
        this.eventEmitter.emit('post.status.changed', {
            postId: post.id,
            authorId: post.authorId,
            title: post.title.toString(),
            status: post.status,
            link : post.slug,
            authorName : authorName
        });
    }
}
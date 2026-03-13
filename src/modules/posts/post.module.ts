import { Module } from '@nestjs/common';
import { AuthModule } from '../shared/auth/auth.module';
import { LoggingModule } from '../shared/logging/logging.module';
import { CreatePostUseCase } from './application/use-cases/create-post.use-case';
import { DeletePostUseCase } from './application/use-cases/delete-post.use-case';
import { GetPostByIdUseCase } from './application/use-cases/get-post-by-id.use-case';
import { GetPostsUseCase } from './application/use-cases/get-posts.use-case';
import { UpdatePostUseCase } from './application/use-cases/update-post.use-case';
import { PostRepository } from './domain/repositories/post.repository';
import { PostController } from './infrastructure/controllers/post.controller';
// import { InMemoryPostRepository } from './infrastructure/repositories/post.in-memory.repository';
import { SQLitePostRepository } from './infrastructure/repositories/post.sqlite.repository';
import { AddTagToPostUseCase } from './application/use-cases/add-tag-to-post.use-case';
import { TagModule } from '../tags/tag.module';
import { DeleteTagFromPostUseCase } from './application/use-cases/delete-tag-from-post.use-case';
import { GetPostBySlugUseCase } from './application/use-cases/get-post-by-slug.use-case';
import { UpdatePostStatusUseCase } from './application/use-cases/update-post-status.use-case';

@Module({
  imports: [AuthModule, LoggingModule, TagModule],
  controllers: [PostController],
  providers: [
    {
      provide: PostRepository,
      useClass: SQLitePostRepository,
    },

    CreatePostUseCase,
    UpdatePostUseCase,
    DeletePostUseCase,
    GetPostsUseCase,
    GetPostByIdUseCase,
    AddTagToPostUseCase,
    DeleteTagFromPostUseCase,
    GetPostBySlugUseCase,
    UpdatePostStatusUseCase
  ],
  exports: [PostRepository]
})
export class PostModule {}

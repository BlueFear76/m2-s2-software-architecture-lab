import { Module } from '@nestjs/common';
import { AuthModule } from '../shared/auth/auth.module';
import { LoggingModule } from '../shared/logging/logging.module';
import { PostModule } from '../posts/post.module';

import { CommentRepository } from './domain/repositories/comment.repository';
import { CommentController } from './infrastructure/controllers/comment.controller';
import { SQLiteCommentRepository } from './infrastructure/repositories/comment.sqlite.repository';

// Use Cases
import { CreateCommentUseCase } from './application/use-cases/create-comment.use-case';
import { UpdateCommentUseCase } from './application/use-cases/update-comment.use-case';

@Module({
  imports: [
    AuthModule, 
    LoggingModule,
    PostModule
  ],
  controllers: [CommentController],
  providers: [
    {
      provide: CommentRepository,
      useClass: SQLiteCommentRepository,
    },

    CreateCommentUseCase,
    UpdateCommentUseCase
  ],
  exports: [CommentRepository],
})
export class CommentsModule {}
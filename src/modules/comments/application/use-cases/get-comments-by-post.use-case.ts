import { Injectable } from '@nestjs/common';
import { CommentRepository } from '../../domain/repositories/comment.repository';
import { CommentEntity } from '../../domain/entities/comment.entity';

@Injectable()
export class GetCommentsByPostUseCase {
  constructor(private readonly commentRepository: CommentRepository) {}

  public async execute(
    postId: string,
    query: { page?: number; pageSize?: number; sortBy?: string; order?: 'ASC' | 'DESC' }
  ) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    const sortBy = query.sortBy || 'createdAt';
    const order = query.order || 'DESC';

    const [comments, total] = await Promise.all([
      this.commentRepository.findByPostId(postId, { page, pageSize, sortBy, order }),
      this.commentRepository.countByPostId(postId)
    ]);

    return {
      data: comments.map(c => c.toJSON()),
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }
}
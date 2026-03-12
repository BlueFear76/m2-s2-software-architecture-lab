import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CommentEntity } from '../../domain/entities/comment.entity';
import { CommentRepository } from '../../domain/repositories/comment.repository';
import { SQLiteCommentEntity } from '../entities/comment.sqlite.entity';

@Injectable()
export class SQLiteCommentRepository implements CommentRepository {
  constructor(private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(SQLiteCommentEntity);
  }

  public async save(comment: CommentEntity): Promise<void> {
    // .save() de TypeORM gère l'INSERT et l'UPDATE automatiquement via l'ID
    await this.repository.save(comment.toJSON());
  }

  public async findById(id: string): Promise<CommentEntity | undefined> {
    const comment = await this.repository.findOne({ where: { id } });
    return comment ? CommentEntity.reconstitute({ ...comment }) : undefined;
  }

  public async findByPostId(postId: string): Promise<CommentEntity[]> {
    const comments = await this.repository.find({
      where: { postId },
      order: { createdAt: 'DESC' },
    });

    return comments.map((c) => CommentEntity.reconstitute({ ...c }));
  }

  public async countByPostId(postId: string): Promise<number> {
    return await this.repository.count({ where: { postId } });
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
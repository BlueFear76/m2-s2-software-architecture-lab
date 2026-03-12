import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('comments')
export class SQLiteCommentEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  content: string;

  @Column()
  authorId: string;

  @Column()
  postId: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
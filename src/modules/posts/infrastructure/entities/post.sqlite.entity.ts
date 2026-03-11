import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import type { PostStatus } from '../../domain/entities/post.entity';
import { SQLiteTagEntity } from 'src/modules/tags/infrastructure/entities/tag.sqlite.entity';

@Entity('posts')
export class SQLitePostEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  status: PostStatus;

  @Column()
  authorId: string;

  @ManyToMany(() => SQLiteTagEntity, (tag) => tag.posts)
  @JoinTable({
    name: 'posts_tags',
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: SQLiteTagEntity[];

  @Column({ unique: true })
  slug: string;
}

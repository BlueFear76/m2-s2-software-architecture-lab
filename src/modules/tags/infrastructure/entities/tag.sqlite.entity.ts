import { SQLitePostEntity } from 'src/modules/posts/infrastructure/entities/post.sqlite.entity';
import { Column, Entity, PrimaryColumn , CreateDateColumn, ManyToMany } from 'typeorm';

@Entity('tags')
export class SQLiteTagEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => SQLitePostEntity, (post) => post.tags)
  posts: SQLitePostEntity[];
}
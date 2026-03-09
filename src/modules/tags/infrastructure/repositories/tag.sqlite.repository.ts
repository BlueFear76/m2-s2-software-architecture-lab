import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TagEntity } from '../../domain/entities/tag.entity';
import { TagRepository } from '../../domain/repositories/tag.repository';
import { SQLiteTagEntity } from '../entities/tag.sqlite.entity';

@Injectable()
export class SQLiteTagRepository implements TagRepository {
  constructor(private readonly dataSource: DataSource) {}

  public async getTags(): Promise<TagEntity[]> {
    const data = await this.dataSource.getRepository(SQLiteTagEntity).find();

    return data.map((tag) => TagEntity.reconstitute({ ...tag }));
  }

  public async getTagById(id: string): Promise<TagEntity | undefined> {
    const tag = await this.dataSource
      .getRepository(SQLiteTagEntity)
      .findOne({ where: { id } });

    return tag ? TagEntity.reconstitute({ ...tag }) : undefined;
  }

  public async getTagByName(name: string): Promise<TagEntity | undefined> {
    const tag = await this.dataSource
      .getRepository(SQLiteTagEntity)
      .findOne({ where: { name } });

    return tag ? TagEntity.reconstitute({ ...tag }) : undefined;
  }

  public async createTag(input: TagEntity): Promise<void> {
    await this.dataSource.getRepository(SQLiteTagEntity).save(input.toJSON());
  }

  public async updateTag(id: string, input: TagEntity): Promise<void> {
    await this.dataSource
      .getRepository(SQLiteTagEntity)
      .update(id, input.toJSON());
  }

  public async deleteTag(id: string): Promise<void> {
    await this.dataSource.getRepository(SQLiteTagEntity).delete(id);
  }
}

import { Injectable } from '@nestjs/common';
import { TagEntity } from '../../domain/entities/tag.entity';
import { TagRepository } from '../../domain/repositories/tag.repository';

@Injectable()
export class InMemoryTagRepository implements TagRepository {
  private tags: Record<string, unknown>[] = [];

  public getTags(): TagEntity[] {
    console.log('InMemoryTagRepository.getTags');
    return this.tags.map((tag) => TagEntity.reconstitute(tag));
  }

  public getTagById(id: string) {
    const tag = this.tags.find((tag) => tag.id === id);

    if (tag) {
      return TagEntity.reconstitute(tag);
    }
  }

  public getTagByName(name: string) {
    const tag = this.tags.find((tag) => tag.name === name);

    if (tag) {
      return TagEntity.reconstitute(tag);
    }
  }

  public createTag(input: TagEntity) {
    this.tags.push(input.toJSON());
  }

  public updateTag(id: string, input: TagEntity) {
    this.tags = this.tags.map((tag) => {
      if (tag.id !== id) {
        return tag;
      }

      return input.toJSON();
    });
  }

  public deleteTag(id: string) {
    this.tags = this.tags.filter((tag) => tag.id !== id);
  }
}

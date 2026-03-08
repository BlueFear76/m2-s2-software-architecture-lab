import { TagEntity } from '../entities/tag.entity';

// export type PostModel = {
//   id: string;
//   title: string;
//   content: string;
//   status: 'draft' | 'waiting_validation' | 'accepted' | 'rejected';
//   authorId: string;
// };

export type CreateTagModel = {
  name: string;
};

export type UpdateTagModel = Partial<CreateTagModel>;

export abstract class TagRepository {
  public abstract getTags(): TagEntity[] | Promise<TagEntity[]>;

  public abstract getTagById(
    id: string,
  ): TagEntity | undefined | Promise<TagEntity | undefined>;

  public abstract createTag(input: TagEntity): void | Promise<void>;

  public abstract updateTag(
    id: string,
    input: TagEntity,
  ): void | Promise<void>;

  public abstract deleteTag(id: string): void | Promise<void>;
}

import { v4 } from 'uuid';
import { TagName } from '../value-objects/tag-name.value-object';

export class TagEntity {
  private _name: TagName;
  private _createdAt: Date;

  private constructor(
    readonly id: string,
    name: TagName,
    createdAt: Date,
  ) {
    this._name = name;
    this._createdAt = createdAt;
  }

  public get name() {
    return this._name;
  }

  public static reconstitute(input: Record<string, unknown>): TagEntity {
    return new TagEntity(
      input.id as string,
      new TagName(input.name as string),
      new Date(input.createdAt as string),
    );
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      name: this._name.toString(),
      createdAt: this._createdAt.toISOString(),
    };
  }

  public static create(name : string): TagEntity {
    return new TagEntity(
      v4(),
      new TagName(name),
      new Date(),
    );
  }

  public update(name?: string) {
    if (name) {
      this._name = new TagName(name);
    }
  }
}

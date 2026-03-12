import { v4 } from 'uuid';

export class CommentContent {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Comment content cannot be empty');
    }
    if (value.length > 1000) {
      throw new Error('Comment content cannot exceed 1000 characters');
    }
  }

  toString() {
    return this.value;
  }
}

export class CommentEntity {
  private constructor(
    readonly id: string,
    private _content: CommentContent,
    readonly authorId: string,
    readonly postId: string,
    readonly createdAt: Date,
    private _updatedAt: Date,
  ) {}

  public static create(content: string, authorId: string, postId: string): CommentEntity {
    return new CommentEntity(
      v4(),
      new CommentContent(content),
      authorId,
      postId,
      new Date(),
      new Date(),
    );
  }

  public updateContent(newContent: string): void {
    this._content = new CommentContent(newContent);
    this._updatedAt = new Date();
  }

  public toJSON() {
    return {
      id: this.id,
      content: this._content.toString(),
      authorId: this.authorId,
      postId: this.postId,
      createdAt: this.createdAt,
      updatedAt: this._updatedAt,
    };
  }

  // Getters nécessaires pour les autorisations
  get content() { return this._content.toString(); }
}
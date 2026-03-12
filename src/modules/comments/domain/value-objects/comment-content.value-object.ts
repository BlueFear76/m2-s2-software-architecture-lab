export class CommentContent {
  private readonly value: string;

  constructor(value: string) {

    if (!value || value.trim().length === 0) {
      throw new Error('Comment content cannot be empty');
    }

    if (value.length > 1000) {
      throw new Error('Comment content must be between 1 and 1000 characters');
    }

    this.value = value;
  }

  public getValue(): string {
    return this.value;
  }

  public toString(): string {
    return this.value;
  }
}
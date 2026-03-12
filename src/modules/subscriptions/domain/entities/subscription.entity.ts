export class SubscriptionEntity {
  private _followerId: string;
  private _followingId: string;
  private _createdAt: Date;

  private constructor(
    followerId: string,
    followingId: string,
    createdAt: Date = new Date()
  ) {
    this._followerId = followerId;
    this._followingId = followingId;
    this._createdAt = createdAt;
  }
  
  public get followerId(): string {
    return this._followerId;
  }

  public get followingId(): string {
    return this._followingId;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }
  public static reconstitute(input: Record<string, any>): SubscriptionEntity {
    return new SubscriptionEntity(
      input.followerId,
      input.followingId,
      input.createdAt
    );
  }

  static create(followerId: string, followingId: string): SubscriptionEntity {
    if (followerId === followingId) {
      throw new Error('A user cannot follow themselves');
    }

    return new SubscriptionEntity(followerId, followingId);
  }

  public toJSON(): Record<string, any> {
    return {
      followerId: this._followerId,
      followingId: this._followingId,
      createdAt: this._createdAt,
    };
  }
}
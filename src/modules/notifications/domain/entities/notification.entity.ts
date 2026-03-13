export enum NotificationType {
  POST_PENDING_REVIEW = 'POST_PENDING_REVIEW',
  POST_APPROVED = 'POST_APPROVED',
  POST_REJECTED = 'POST_REJECTED',
  POST_DELETED = 'POST_DELETED',
  NEW_COMMENT = 'NEW_COMMENT',
  NEW_POST_FROM_FOLLOWED = 'NEW_POST_FROM_FOLLOWED',
}

export class NotificationEntity {
  private _id: string;
  private _recipientId: string;
  private _type: NotificationType;
  private _title: string;
  private _message: string;
  private _link: string;
  private _isRead: boolean;
  private _createdAt: Date;
  private _metadata: Record<string, any>;

  private constructor(
    id: string,
    recipientId: string,
    type: NotificationType,
    title: string,
    message: string,
    link: string,
    isRead: boolean,
    createdAt: Date,
    metadata: Record<string, any>
  ) {
    this._id = id;
    this._recipientId = recipientId;
    this._type = type;
    this._title = title;
    this._message = message;
    this._link = link;
    this._isRead = isRead;
    this._createdAt = createdAt;
    this._metadata = metadata;
  }

  public get id(): string { return this._id; }
  public get recipientId(): string { return this._recipientId; }
  public get type(): NotificationType { return this._type; }
  public get title(): string { return this._title; }
  public get message(): string { return this._message; }
  public get link(): string { return this._link; }
  public get isRead(): boolean { return this._isRead; }
  public get createdAt(): Date { return this._createdAt; }
  public get metadata(): Record<string, any> { return this._metadata; }

  public markAsRead(): void {
    this._isRead = true;
  }

  public static reconstitute(input: Record<string, any>): NotificationEntity {
    return new NotificationEntity(
      input.id,
      input.recipientId,
      input.type,
      input.title,
      input.message,
      input.link,
      input.isRead,
      input.createdAt,
      input.metadata || {}
    );
  }

  public static create(props: {
    id: string;
    recipientId: string;
    type: NotificationType;
    title: string;
    message: string;
    link: string;
    metadata?: Record<string, any>;
  }): NotificationEntity {
    return new NotificationEntity(
      props.id,
      props.recipientId,
      props.type,
      props.title,
      props.message,
      props.link,
      false,
      new Date(),
      props.metadata || {}
    );
  }

  public toJSON(): Record<string, any> {
    return {
      id: this._id,
      recipientId: this._recipientId,
      type: this._type,
      title: this._title,
      message: this._message,
      link: this._link,
      isRead: this._isRead,
      createdAt: this._createdAt,
      metadata: this._metadata,
    };
  }
}
import { PostEntity } from '../../../posts/domain/entities/post.entity';
import { UserRole } from '../entities/user.entity';

export class PostPermissions {
  constructor(
    private readonly userId: string,
    private readonly role: UserRole,
  ) { }

  public canCreate(): boolean {
    return this.role === 'writer';
  }

  public canUpdateContent(post: PostEntity): boolean {
    return post.status === 'draft' && post.authorId === this.userId;
  }

  public canReadPost(post: PostEntity): boolean {
    // On compare les valeurs brutes (strings)
    const postAuthorId = typeof post.authorId === 'object' ? (post.authorId as any).value : post.authorId;
    const currentUserId = typeof this.userId === 'object' ? (this.userId as any).value : this.userId;

    if (postAuthorId === currentUserId) return true;

    if (this.role === 'admin' || this.role === 'moderator') return true;

    return post.status === 'accepted';
  }
}

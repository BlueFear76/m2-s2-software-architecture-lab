import { UserEntity } from "src/modules/users/domain/entities/user.entity";
import { CommentEntity } from "../entities/comment.entity";

export class CommentPermissions {
  constructor(
    private readonly user: UserEntity,
    private readonly comment: CommentEntity,
    private readonly postAuthorId?: string, // Optionnel, nécessaire pour la règle "Post Author"
  ) {}

  public canUpdate(): boolean {
    // Règle : Seul l'auteur du commentaire peut modifier
    return this.user.id === this.comment.authorId;
  }

  public canDelete(): boolean {
    // Règle ADMIN ou MODERATOR
    if (this.user.role === 'admin' || this.user.role === 'moderator') {
      return true;
    }

    // Règle : Auteur du commentaire
    if (this.user.id === this.comment.authorId) {
      return true;
    }

    // Règle : Auteur du post
    if (this.postAuthorId && this.user.id === this.postAuthorId) {
      return true;
    }

    return false;
  }
}
import { CommentEntity } from "../entities/comment.entity";

export abstract class CommentRepository {

  public abstract save(comment: CommentEntity): Promise<void>;

  public abstract findById(id: string): Promise<CommentEntity | undefined>;

  public abstract findByPostId(postId: string, options: any): Promise<CommentEntity[]>;

  public abstract delete(id: string): Promise<void>;
}
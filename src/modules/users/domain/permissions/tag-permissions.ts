import { UserRole } from '../entities/user.entity';

export class TagPermissions {
  constructor(
    private readonly userId: string,
    private readonly role: UserRole,
  ) {}

  public canCreate(): boolean {
    return this.role === 'admin';
  }

  public canUpdateName(): boolean {
    return this.role === 'admin';
  }

  public canDeleteTag(): boolean {
    return this.role === 'admin';
  }
}

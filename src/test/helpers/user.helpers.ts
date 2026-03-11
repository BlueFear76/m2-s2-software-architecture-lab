import { UserEntity } from '../../modules/users/domain/entities/user.entity';

export function makeUserWithPermission(): UserEntity {
  return {
    id: 'user-1',
    permissions: {
      posts: {
        canCreate: () => true,
        canReadPost: (post: any) => {
          if (post.authorId === 'user-1') return true;
          if (post.status === 'accepted') return true;
          return false;
        },
        canUpdateContent: () => true,
      },
      tags: {
        isAdmin: () => true,
      },
    },
  } as unknown as UserEntity;
}

export function makeUserWithoutPermission(): UserEntity {
  return {
    id: 'user-2',
    permissions: {
      posts: {
        canCreate: () => false,
        canReadPost: () => false,
        canUpdateContent: () => false,
      },
      tags: {
        isAdmin: () => false,
      },
    },
  } as unknown as UserEntity;
}

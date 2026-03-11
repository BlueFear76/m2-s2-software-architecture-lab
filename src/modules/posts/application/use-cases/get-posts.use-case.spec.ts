import { 
  makeUserWithPermission 
} from '../../../../test/helpers/user.helpers';
import { PostRepository } from '../../domain/repositories/post.repository';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { GetPostsUseCase } from './get-posts.use-case';
import { PostEntity } from '../../domain/entities/post.entity';

describe('GetPostsUseCase', () => {
  let useCase: GetPostsUseCase;
  let postRepository: jest.Mocked<PostRepository>;
  let loggingService: jest.Mocked<LoggingService>;

  beforeEach(() => {
    postRepository = {
      getPosts: jest.fn(),
    } as unknown as jest.Mocked<PostRepository>;
    
    loggingService = {
      log: jest.fn(),
    } as unknown as jest.Mocked<LoggingService>;

    useCase = new GetPostsUseCase(postRepository, loggingService);
  });

 it('should return only posts the user is allowed to see', async () => {
    const user = makeUserWithPermission(); 
    
    // 1. Post d'un autre mais accepté
    const publicPost = PostEntity.create('Public Title', 'Content', 'user-2');
    
    // On force la propriété PRIVÉE (regarde dans ton PostEntity si c'est _status ou status)
    // En JS/TS, on peut accéder aux champs privés avec cette syntaxe en test :
    (publicPost as any)._status = 'accepted'; 
    // Si ça ne marche pas, essaie : (publicPost as any).props.status = 'accepted';

    // 2. Mon propre draft
    const myDraft = PostEntity.create('My Draft', 'Content', 'user-1');

    // 3. Draft d'un autre
    const secretDraft = PostEntity.create('Secret Draft', 'Content', 'user-2');

    postRepository.getPosts.mockResolvedValue([publicPost, myDraft, secretDraft]);

    const result = await useCase.execute(user);

    expect(result).toHaveLength(2);
    expect(result).toContain(publicPost);
    expect(result).toContain(myDraft);
    expect(result).not.toContain(secretDraft);
  });

  it('should return an empty array if no posts are visible', async () => {
    // Arrange
    const user = makeUserWithPermission();
    const secretDraft = PostEntity.create('Secret', 'Content', 'user-2');
    
    postRepository.getPosts.mockResolvedValue([secretDraft]);

    // Act
    const result = await useCase.execute(user);

    // Assert
    expect(result).toHaveLength(0);
  });
});
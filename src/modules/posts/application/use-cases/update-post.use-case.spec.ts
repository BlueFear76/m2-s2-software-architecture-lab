import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { 
  makeUserWithPermission, 
  makeUserWithoutPermission 
} from '../../../../test/helpers/user.helpers';
import { PostRepository } from '../../domain/repositories/post.repository';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { UpdatePostUseCase } from './update-post.use-case';

describe('UpdatePostUseCase', () => {
  let useCase: UpdatePostUseCase;
  let postRepository: jest.Mocked<PostRepository>;
  let loggingService: jest.Mocked<LoggingService>;

  beforeEach(() => {
    // On suit ton modèle de mock
    postRepository = {
      getPostById: jest.fn(),
      updatePost: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<PostRepository>;
    
    loggingService = {
      log: jest.fn(),
    } as unknown as jest.Mocked<LoggingService>;

    useCase = new UpdatePostUseCase(postRepository, loggingService);
  });

  it('should update a post when user has permission and post exists', async () => {
    // Arrange (Comme ton test de Tag)
    const user = makeUserWithPermission();
    const postId = 'existing-id';
    const updateDto = { title: 'new-title', content: 'new-content' };

    // On mocke le post avec une fonction update et la structure attendue
    const mockPost = { 
        id: postId, 
        update: jest.fn() 
    } as any;

    postRepository.getPostById.mockResolvedValue(mockPost);

    // Act
    await useCase.execute(postId, updateDto, user);

    // Assert
    expect(postRepository.updatePost).toHaveBeenCalledTimes(1);
    expect(loggingService.log).toHaveBeenCalled();
  });

  it('should throw NotFoundException when post does not exist', async () => {
    // Arrange
    const user = makeUserWithPermission();
    postRepository.getPostById.mockResolvedValue(undefined);

    // Act & Assert
    await expect(useCase.execute('fake-id', { title: 'new' }, user))
      .rejects.toThrow(NotFoundException);

    expect(postRepository.updatePost).not.toHaveBeenCalled();
  });

  it('should throw ForbiddenException when user does not have permission', async () => {
    // Arrange
    const user = makeUserWithoutPermission();
    // Même si le post existe, le user n'a pas le droit
    postRepository.getPostById.mockResolvedValue({ id: 'id' } as any);

    // Act & Assert
    await expect(useCase.execute('id', { title: 'new' }, user))
      .rejects.toThrow(ForbiddenException);

    expect(postRepository.updatePost).not.toHaveBeenCalled();
  });
});
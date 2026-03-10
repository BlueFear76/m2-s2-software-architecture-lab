import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  makeUserWithoutPermission,
  makeUserWithPermission,
} from '../../../../test/helpers/user.helpers';
import { TagCreatedEvent } from '../../domain/events/tag-created.event';
import { UserCannotCreateTagException } from '../../domain/exceptions/user-cannot-create-tag.exception';
import { TagRepository } from '../../domain/repositories/tag.repository';
import { CreateTagUseCase } from './create-tag.use-case';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { TagAlreadyExistsException } from '../../domain/exceptions/tag-already-exists.exception';

describe('CreateTagUseCase', () => {
  let useCase: CreateTagUseCase;
  let tagRepository: jest.Mocked<TagRepository>;
  let eventEmitter: jest.Mocked<EventEmitter2>;
  let loggingService: jest.Mocked<LoggingService>;

  beforeEach(() => {
    tagRepository = {
      getTagByName: jest.fn().mockResolvedValue(undefined),
      createTag: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<TagRepository>;
    eventEmitter = {
      emit: jest.fn(),
    } as unknown as jest.Mocked<EventEmitter2>;
    loggingService = {
      log: jest.fn(),
    } as unknown as jest.Mocked<LoggingService>;
    useCase = new CreateTagUseCase(eventEmitter, tagRepository, loggingService);
  });

  it('should create a tag and emit an event when user has permission', async () => {
    // Arrange
    const user = makeUserWithPermission();
    const createTagDto = {
      name: 'my-first-tag',
    };

    // Act
    await useCase.execute(createTagDto, user);

    // Assert
    expect(tagRepository.createTag).toHaveBeenCalledTimes(1);
    expect(eventEmitter.emit).toHaveBeenCalledWith(
      TagCreatedEvent,
      expect.objectContaining({ tagId: expect.any(String) }),
    );
  });

  it('should throw UserCannotCreateTagException when user does not have permission', async () => {
    // Arrange
    const user = makeUserWithoutPermission();
    const createTagDto = {
      name: 'my-first-tag',
    };

    // Act
    const act = () => useCase.execute(createTagDto, user);

    // Assert
    await expect(act).rejects.toThrow(UserCannotCreateTagException);
    expect(tagRepository.createTag).not.toHaveBeenCalled();
    expect(eventEmitter.emit).not.toHaveBeenCalled();
  });

  it('should throw TagAlreadyExistsException when tag exists', async () => {
  const user = makeUserWithPermission();
  const createTagDto = { name: 'my-first-tag' };

  tagRepository.getTagByName.mockResolvedValue({} as any); // Tag existe

  await expect(useCase.execute(createTagDto, user))
    .rejects.toThrow(TagAlreadyExistsException);
});
});

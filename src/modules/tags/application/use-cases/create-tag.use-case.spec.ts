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

describe('CreateTagUseCase', () => {
  let useCase: CreateTagUseCase;
  let tagRepository: jest.Mocked<TagRepository>;
  let eventEmitter: jest.Mocked<EventEmitter2>;
  let loggingService: jest.Mocked<LoggingService>;

  beforeEach(() => {
    tagRepository = {
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
      name: 'My first Tag',
    };

    // Act
    await useCase.execute(createTagDto, user);

    // Assert
    expect(tagRepository.createTag).toHaveBeenCalledTimes(1);
    expect(eventEmitter.emit).toHaveBeenCalledWith(
      TagCreatedEvent,
      expect.objectContaining({ name: createTagDto.name }),
    );
  });

  it('should throw UserCannotCreateTagException when user does not have permission', async () => {
    // Arrange
    const user = makeUserWithoutPermission();
    const createTagDto = {
      name: 'My first Tag',
    };

    // Act
    const act = () => useCase.execute(createTagDto, user);

    // Assert
    await expect(act).rejects.toThrow(UserCannotCreateTagException);
    expect(tagRepository.createTag).not.toHaveBeenCalled();
    expect(eventEmitter.emit).not.toHaveBeenCalled();
  });
});

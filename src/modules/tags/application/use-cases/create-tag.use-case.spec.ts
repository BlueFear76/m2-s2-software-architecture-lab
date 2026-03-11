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
import { BadRequestException } from '@nestjs/common';

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

  // --- Tes tests existants (déjà très bons) ---

  it('should create a tag and emit an event when user has permission', async () => {
    const user = makeUserWithPermission();
    const tagName = 'my-first-tag';
    const createTagDto = { name: tagName };

    const result = await useCase.execute(createTagDto, user);

    expect(result.id).toBeDefined();
    // On utilise toString() qui est public dans ton TagName
    expect(result.name.toString()).toBe(tagName); 

    expect(tagRepository.createTag).toHaveBeenCalledTimes(1);
    
    expect(eventEmitter.emit).toHaveBeenCalledWith(
      TagCreatedEvent,
      expect.objectContaining({ 
        tagId: result.id,
        tagName: tagName
      }),
    );
  });

  it('should throw UserCannotCreateTagException when user does not have permission', async () => {
    const user = makeUserWithoutPermission();
    const createTagDto = { name: 'my-first-tag' };

    const act = () => useCase.execute(createTagDto, user);

    await expect(act).rejects.toThrow(UserCannotCreateTagException);
    expect(tagRepository.createTag).not.toHaveBeenCalled();
  });

  it('should throw TagAlreadyExistsException when tag exists', async () => {
    const user = makeUserWithPermission();
    const createTagDto = { name: 'my-first-tag' };
    tagRepository.getTagByName.mockResolvedValue({ id: 'existing-id' } as any);

    await expect(useCase.execute(createTagDto, user))
      .rejects.toThrow(TagAlreadyExistsException);
  });

  // --- Nouveaux tests pour le format (400 Bad Request) ---

  it('should throw BadRequestException for invalid name format (Uppercase/Spaces)', async () => {
    const user = makeUserWithPermission();
    // On teste "Java Script" qui devrait être rejeté si le Use Case ne normalise pas
    // Ou renvoyer 400 si ton Value Object bloque.
    const createTagDto = { name: 'Java Script' };

    await expect(useCase.execute(createTagDto, user))
      .rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when tag name is too short', async () => {
    const user = makeUserWithPermission();
    const createTagDto = { name: 'a' }; // 1 seul caractère (le sujet dit 2-50)

    await expect(useCase.execute(createTagDto, user))
      .rejects.toThrow(BadRequestException);
  });

  it('should successfully create a tag when name is correctly normalized', async () => {
    const user = makeUserWithPermission();
    const createTagDto = { name: 'typescript' };

    await useCase.execute(createTagDto, user);

    const savedTag = tagRepository.createTag.mock.calls[0][0];
    expect(savedTag.name.toString()).toBe('typescript');
  });
});
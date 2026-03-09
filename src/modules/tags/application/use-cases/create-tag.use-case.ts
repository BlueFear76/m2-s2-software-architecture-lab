import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { TagEntity } from '../../domain/entities/tag.entity';
import { TagCreatedEvent } from '../../domain/events/tag-created.event';
import { UserCannotCreateTagException } from '../../domain/exceptions/user-cannot-create-tag.exception';
import { TagAlreadyExistsException } from '../../domain/exceptions/tag-already-exists.exception';
import { TagRepository } from '../../domain/repositories/tag.repository';
import { CreateTagDto } from '../dtos/create-tag.dto';

@Injectable()
export class CreateTagUseCase {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly tagRepository: TagRepository,
    private readonly loggingService: LoggingService,
  ) { }

  public async execute(input: CreateTagDto, user: UserEntity): Promise<void> {
    this.loggingService.log('CreateTagUseCase.execute');

    if (!user.permissions.tags.canCreate()) {
      throw new UserCannotCreateTagException();
    }

    const existingTag = await this.tagRepository.getTagByName(input.name);
    if (existingTag) {
      throw new TagAlreadyExistsException();
    }

    const tag = TagEntity.create(input.name);

    await this.tagRepository.createTag(tag);

    this.eventEmitter.emit(TagCreatedEvent, {
      tagId: tag.id,
    });
  }
}
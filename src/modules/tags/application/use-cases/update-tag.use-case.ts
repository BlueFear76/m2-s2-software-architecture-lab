import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter'; // Ajouté pour la cohérence
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { TagRepository } from '../../domain/repositories/tag.repository';
import { UpdateTagDto } from '../dtos/update-tag.dto';
import { TagAlreadyExistsException } from '../../domain/exceptions/tag-already-exists.exception';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { UserCannotUpdateTagException } from '../../domain/exceptions/user-cannot-update-tag.exception';

@Injectable()
export class UpdateTagUseCase {
  constructor(
    private readonly tagRepository: TagRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly loggingService: LoggingService,
  ) {}

  public async execute(id: string, input: UpdateTagDto, user: UserEntity): Promise<void> {
    this.loggingService.log('UpdateTagUseCase.execute');

    if (!user.permissions.tags.isAdmin()) { 
      throw new UserCannotUpdateTagException();
    }

    const tag = await this.tagRepository.getTagById(id);
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    if (input.name) {
      const existingTag = await this.tagRepository.getTagByName(input.name);
      if (existingTag && existingTag.id !== id) {
        throw new TagAlreadyExistsException();
      }
      
      tag.update(input.name);
      
      await this.tagRepository.updateTag(id, tag);

      this.eventEmitter.emit('tag.updated', { tagId: id, name: input.name });
    }
  }
}
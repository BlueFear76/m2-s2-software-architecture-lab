import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { TagRepository } from '../../domain/repositories/tag.repository';
import { UpdateTagDto } from '../dtos/update-tag.dto';
import { TagAlreadyExistsException } from '../../domain/exceptions/tag-already-exists.exception';

@Injectable()
export class UpdateTagUseCase {
  constructor(
    private readonly tagRepository: TagRepository,
    private readonly loggingService: LoggingService,
  ) { }

  public async execute(id: string, input: UpdateTagDto): Promise<void> {
    this.loggingService.log('UpdateTagUseCase.execute');
    const tag = await this.tagRepository.getTagById(id);

    const existingTag = await this.tagRepository.getTagByName(input.name);

    if (existingTag && existingTag.id !== id) {
      throw new TagAlreadyExistsException();
    }

    if (tag) {
      tag.update(input.name);
      await this.tagRepository.updateTag(id, tag);
    }
  }
}

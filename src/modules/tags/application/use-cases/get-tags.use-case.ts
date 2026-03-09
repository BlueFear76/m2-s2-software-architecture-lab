import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { TagEntity } from '../../domain/entities/tag.entity';
import { TagRepository } from '../../domain/repositories/tag.repository';

@Injectable()
export class GetTagsUseCase {
  constructor(
    private readonly tagRepository: TagRepository,
    private readonly loggingService: LoggingService,
  ) {}

  public async execute(): Promise<TagEntity[]> {
    this.loggingService.log('GetTagsUseCase.execute');
    return this.tagRepository.getTags();
  }
}

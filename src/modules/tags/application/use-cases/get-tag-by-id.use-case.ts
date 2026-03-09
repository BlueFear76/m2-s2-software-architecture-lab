import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { TagEntity } from '../../domain/entities/tag.entity';
import { TagRepository } from '../../domain/repositories/tag.repository';

@Injectable()
export class GetTagByIdUseCase {
  constructor(
    private readonly tagRepository: TagRepository,
    private readonly loggingService: LoggingService,
  ) { }

  public async execute(
    id: string
  ): Promise<TagEntity | undefined> {
    this.loggingService.log('GetTagByIdUseCase.execute');
    const tag = await this.tagRepository.getTagById(id);
    if (!tag) return;

    return tag;
  }
}

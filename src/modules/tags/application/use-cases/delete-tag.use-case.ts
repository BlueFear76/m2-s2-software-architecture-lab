import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { TagRepository } from '../../domain/repositories/tag.repository';

@Injectable()
export class DeleteTagUseCase {
  constructor(
    private readonly tagRepository: TagRepository,
    private readonly loggingService: LoggingService,
  ) {}

  public async execute(id: string): Promise<void> {
    this.loggingService.log('DeleteTagUseCase.execute');
    await this.tagRepository.deleteTag(id);
  }
}

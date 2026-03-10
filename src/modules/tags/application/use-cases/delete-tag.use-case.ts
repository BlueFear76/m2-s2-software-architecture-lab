import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { TagRepository } from '../../domain/repositories/tag.repository';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { UserCannotDeleteTagException } from '../../domain/exceptions/user-cannot-delete-tag.exception';

@Injectable()
export class DeleteTagUseCase {
  constructor(
    private readonly tagRepository: TagRepository,
    private readonly loggingService: LoggingService,
  ) {}

  public async execute(id: string, user: UserEntity): Promise<void> {
    this.loggingService.log('DeleteTagUseCase.execute');

    if (!user.permissions.tags.isAdmin()) { 
      throw new UserCannotDeleteTagException();
    }
    await this.tagRepository.deleteTag(id);
  }
}

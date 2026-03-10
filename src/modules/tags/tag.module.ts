import { Module } from '@nestjs/common';
import { AuthModule } from '../shared/auth/auth.module';
import { LoggingModule } from '../shared/logging/logging.module';
import { CreateTagUseCase } from './application/use-cases/create-tag.use-case';
import { DeleteTagUseCase } from './application/use-cases/delete-tag.use-case';
import { GetTagByIdUseCase } from './application/use-cases/get-tag-by-id.use-case';
import { GetTagByNameUseCase } from './application/use-cases/get-tag-by-name.use-case';
import { GetTagsUseCase } from './application/use-cases/get-tags.use-case';
import { UpdateTagUseCase } from './application/use-cases/update-tag.use-case';
import { TagRepository } from './domain/repositories/tag.repository';
import { TagController } from './infrastructure/controllers/tag.controller';
// import { InMemoryTagRepository } from './infrastructure/repositories/tag.in-memory.repository';
import { SQLiteTagRepository } from './infrastructure/repositories/tag.sqlite.repository';

@Module({
  imports: [AuthModule, LoggingModule],
  controllers: [TagController],
  providers: [
    {
      provide: TagRepository,
      useClass: SQLiteTagRepository,
    },

    CreateTagUseCase,
    UpdateTagUseCase,
    DeleteTagUseCase,
    GetTagsUseCase,
    GetTagByIdUseCase,
    GetTagByNameUseCase,
  ],
  exports: [TagRepository],
})
export class TagModule {}

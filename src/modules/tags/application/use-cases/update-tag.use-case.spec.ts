import { EventEmitter2 } from '@nestjs/event-emitter';
import {
    makeUserWithoutPermission,
    makeUserWithPermission,
} from '../../../../test/helpers/user.helpers';
import { TagRepository } from '../../domain/repositories/tag.repository';
import { UpdateTagUseCase } from './update-tag.use-case';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { NotFoundException } from '@nestjs/common';
import { UserCannotUpdateTagException } from '../../domain/exceptions/user-cannot-update-tag.exception';

describe('UpdateTagUseCase', () => {
    let useCase: UpdateTagUseCase;
    let tagRepository: jest.Mocked<TagRepository>;
    let eventEmitter: jest.Mocked<EventEmitter2>;
    let loggingService: jest.Mocked<LoggingService>;

    beforeEach(() => {
        tagRepository = {
            getTagById: jest.fn(),
            updateTag: jest.fn().mockResolvedValue(undefined),
            getTagByName: jest.fn().mockResolvedValue(undefined),
        } as unknown as jest.Mocked<TagRepository>;

        eventEmitter = {
            emit: jest.fn(),
        } as unknown as jest.Mocked<EventEmitter2>;

        loggingService = {
            log: jest.fn(),
        } as unknown as jest.Mocked<LoggingService>;

        useCase = new UpdateTagUseCase(tagRepository, eventEmitter, loggingService);
    });

    it('should update a tag when user has permission and tag exists', async () => {

        const user = makeUserWithPermission();
        const tagId = 'existing-id';
        const updateDto = { name: 'new-name' };


        tagRepository.getTagById.mockResolvedValue({ id: tagId, name: 'old-name', update: jest.fn() } as any);

        tagRepository.getTagByName.mockResolvedValue(undefined);

        await useCase.execute(tagId, updateDto, user);


        expect(tagRepository.updateTag).toHaveBeenCalledTimes(1);
        expect(loggingService.log).toHaveBeenCalled();
    });

    it('should throw NotFoundException when tag does not exist', async () => {

        const user = makeUserWithPermission();
        tagRepository.getTagById.mockResolvedValue(undefined); // Le tag n'existe pas


        await expect(useCase.execute('fake-id', { name: 'name' }, user))
            .rejects.toThrow(NotFoundException);

        expect(tagRepository.updateTag).not.toHaveBeenCalled();
    });

    it('should throw UserCannotUpdateTagException when user does not have permission', async () => {

        const user = makeUserWithoutPermission();
        tagRepository.getTagById.mockResolvedValue({ id: 'id' } as any);


        await expect(useCase.execute('id', { name: 'new' }, user))
            .rejects.toThrow(UserCannotUpdateTagException);

        expect(tagRepository.updateTag).not.toHaveBeenCalled();
    });
});
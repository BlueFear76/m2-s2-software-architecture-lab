import { ConflictException } from '@nestjs/common';
import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class TagAlreadyExistsException extends ConflictException {
  constructor() {
    super(
      'Tag already exists',
      'TAG_ALREADY_EXISTS',
    );
  }
}

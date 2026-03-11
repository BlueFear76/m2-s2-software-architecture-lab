import { ForbiddenException } from '@nestjs/common';
import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class UserCannotCreateTagException extends ForbiddenException {
  constructor() {
    super(
      'You do not have permission to create tags',
      'USER_CANNOT_CREATE_TAG',
    );
  }
}

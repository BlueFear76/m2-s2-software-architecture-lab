import { ForbiddenException } from "@nestjs/common";


export class UserCannotCreatePostException extends ForbiddenException {
  constructor() {
    super(
      'You do not have permission to create posts',
      'USER_CANNOT_CREATE_POST',
    );
  }
}

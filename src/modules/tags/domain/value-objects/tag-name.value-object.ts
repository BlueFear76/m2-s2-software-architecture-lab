import { BadRequestException } from "@nestjs/common";

export class TagName {
  private value: string;

  constructor(input: string) {
    this.validate(input);
    this.value = input;
  }

  private validate(input: string) {
    if (input.length === 0) {
      throw new BadRequestException('Name cannot be empty');
    }

    if (input !== input.toLowerCase().trim()) {
      throw new BadRequestException('Tag name must be already normalized (lowercase, no leading/trailing spaces)');
    }

    if (input.length < 2 || input.length > 50) {
      throw new BadRequestException('Tag name must be between 2 and 50 characters');
    }

    if (!/^[a-z0-9\-]+$/.test(input)) {
      throw new BadRequestException('Tag name can only contain lowercase letters, numbers and hyphens');
    }
  }

  public toString() {
    return this.value;
  }
}

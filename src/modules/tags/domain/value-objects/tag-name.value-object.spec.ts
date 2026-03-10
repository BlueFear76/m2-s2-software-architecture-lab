import { TagName } from './tag-name.value-object';

describe('TagName', () => {

  it('should create valid tag name', () => {
    const tagName = new TagName('valid-tag');
    expect(tagName.toString()).toBe('valid-tag');
  });

  it('should reject empty name', () => {
    expect(() => new TagName('')).toThrow('Name cannot be empty');
  });

  it('should reject non-normalized uppercase', () => {
    expect(() => new TagName('Mon-Tag')).toThrow('Tag name must be already normalized');
  });

  it('should reject leading/trailing spaces', () => {
    expect(() => new TagName(' mon-tag ')).toThrow('Tag name must be already normalized');
  });

  it('should reject too short name', () => {
    expect(() => new TagName('a')).toThrow('Tag name must be between 2 and 50 characters');
  });

  it('should reject too long name', () => {
    const longName = 'a'.repeat(51);
    expect(() => new TagName(longName)).toThrow('Tag name must be between 2 and 50 characters');
  });

  it('should reject invalid characters', () => {
    expect(() => new TagName('tag avec espace')).toThrow('Tag name can only contain lowercase letters, numbers and hyphens');
    expect(() => new TagName('tag_underscore')).toThrow('Tag name can only contain lowercase letters, numbers and hyphens');
    expect(() => new TagName('tag@special')).toThrow('Tag name can only contain lowercase letters, numbers and hyphens');
  });

  it.each([
    'valid-tag',
    'tag123',
    'multi-word-tag',
    'a-b-c',
    'short',
  ])('should accept "%s"', (name) => {
    const tagName = new TagName(name);
    expect(tagName.toString()).toBe(name);
  });
});

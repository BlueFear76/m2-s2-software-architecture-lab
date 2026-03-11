export class PostSlug {
  private constructor(private readonly value: string) {}

  public static create(slug: string): PostSlug {

    const cleaned = slug.trim().toLowerCase();

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    
    if (cleaned.length < 3 || cleaned.length > 100) {
      throw new Error('Slug must be between 3 and 100 characters');
    }

    if (!slugRegex.test(cleaned)) {
      throw new Error('Invalid slug format: lowercase, numbers and hyphens only');
    }

    return new PostSlug(cleaned);
  }

  /**
   * Transforme n'importe quel titre en un slug "propre" (base)
   */
  public static fromTitle(title: string): string {
    let slug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

      
    if (!slug || slug === '') {
      return `post-${Math.random().toString(36).substring(2, 7)}`;
    }

    return slug.substring(0, 100); // Troncature à 100 chars
  }

  public toString(): string {
    return this.value;
  }

  public equals(other: PostSlug): boolean {
    return this.value === other.toString();
  }
}
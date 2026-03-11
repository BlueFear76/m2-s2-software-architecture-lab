import { ApiProperty } from "@nestjs/swagger";

export class CreatePostDto {
  @ApiProperty({ 
    description: 'Le titre du post', 
    example: 'Mon premier article' 
  })
  title: string;

  @ApiProperty({ 
    description: 'Le contenu détaillé', 
    example: 'Voici le contenu de mon super post en Clean Architecture.' 
  })
  content: string;

  slug?: string;
}

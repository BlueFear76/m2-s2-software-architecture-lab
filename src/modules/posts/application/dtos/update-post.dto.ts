import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdatePostDto {
  @ApiPropertyOptional({ 
    description: 'Le nouveau titre du post', 
    example: 'Titre mis à jour' 
  })
  title?: string;

  @ApiPropertyOptional({ 
    description: 'Le nouveau contenu du post', 
    example: 'Contenu mis à jour...' 
  })
  content?: string;

  slug?: string;
}

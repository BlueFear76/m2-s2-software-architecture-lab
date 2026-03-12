import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
  @ApiProperty({ 
    description: 'Le contenu du commentaire', 
    example: 'Super article, merci pour le partage !' 
  })
  content: string;
}
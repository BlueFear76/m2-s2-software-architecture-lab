import { ApiProperty } from "@nestjs/swagger";

export class UpdateCommentDto {
  @ApiProperty({ 
    description: 'Le nouveau contenu du commentaire', 
    example: 'Ceci est mon commentaire modifié.' 
  })
  content: string;
}
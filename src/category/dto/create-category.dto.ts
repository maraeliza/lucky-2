import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsOptional, Matches } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Descrição da categoria',
    example: 'Eletrônicos',
    maxLength: 255,
  })
  @IsString({ message: 'A descrição deve ser uma string.' })
  @IsNotEmpty({ message: 'A descrição é obrigatória.' })
  @MaxLength(255, { message: 'A descrição deve ter no máximo 255 caracteres.' })
  description: string = '';

  @ApiProperty({
    description: 'Cor da categoria (hexadecimal ou nome padrão)',
    example: '#ff0000',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'A cor deve ser uma string.' })
  @Matches(/^#([0-9A-Fa-f]{6})$|^(red|green|blue|yellow|orange|purple|pink|black|white|gray|brown|cyan|magenta)$/i, {
    message: 'A cor deve ser um hexadecimal válido (#RRGGBB) ou um nome de cor padrão.',
  })
  color?: string;
}

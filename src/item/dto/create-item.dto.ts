import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsNumber,
  Min,
  IsInt,
} from 'class-validator';

export class CreateItemDto {
  @ApiProperty({
    description: 'Descrição do item',
    example: 'Smartphone Samsung Galaxy S23',
    maxLength: 255,
  })
  @IsString({ message: 'A descrição deve ser uma string.' })
  @IsNotEmpty({ message: 'A descrição é obrigatória.' })
  @MaxLength(255, { message: 'A descrição deve ter no máximo 255 caracteres.' })
  description: string = '';

  @ApiProperty({
    description: 'Preço unitário do item',
    example: 2999.9,
  })
  @IsNumber({}, { message: 'O preço unitário deve ser um número.' })
  @Min(0, { message: 'O preço unitário não pode ser negativo.' })
  unitPrice: number = 0;

  @ApiProperty({
    description: 'ID da categoria do item',
    example: 1,
  })
  @IsInt({ message: 'O ID da categoria deve ser um número inteiro.' })
  @IsNotEmpty({ message: 'O ID da categoria é obrigatório.' })
  categoryId: number = 0;
}

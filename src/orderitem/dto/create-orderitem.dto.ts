import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({ description: 'ID do pedido', example: 1 })
  @IsInt({ message: 'O ID do pedido deve ser um número inteiro.' })
  orderId: number = 0;

  @ApiProperty({ description: 'ID do item', example: 2 })
  @IsInt({ message: 'O ID do item deve ser um número inteiro.' })
  itemId: number = 0;

  @ApiProperty({ description: 'Quantidade do item no pedido', example: 3 })
  @IsInt({ message: 'A quantidade deve ser um número inteiro.' })
  @Min(1, { message: 'A quantidade mínima é 1.' })
  quantity: number = 0;
}

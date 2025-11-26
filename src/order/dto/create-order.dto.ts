import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsEnum,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from 'generated/prisma';
import { CreateOrderItemDto } from 'src/orderitem/dto/create-orderitem.dto';

export enum OrderStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'ID do cliente que realizou o pedido',
    example: 1,
  })
  @IsInt({ message: 'O ID do cliente deve ser um número inteiro.' })
  @IsNotEmpty({ message: 'O ID do cliente é obrigatório.' })
  clientId: number = 0;

  @ApiProperty({
    description: 'Forma de pagamento do pedido',
    example: PaymentMethod.CREDIT,
    enum: PaymentMethod,
  })
  @IsEnum(PaymentMethod, { message: 'Forma de pagamento inválida.' })
  @IsNotEmpty({ message: 'A forma de pagamento é obrigatória.' })
  paymentMethod: PaymentMethod = PaymentMethod.CASH;

  @ApiProperty({
    description: 'Status do pedido',
    example: OrderStatus.PENDING,
    enum: OrderStatus,
    required: false,
  })
  @IsEnum(OrderStatus, { message: 'Status do pedido inválido.' })
  @IsOptional()
  status?: OrderStatus = OrderStatus.PENDING;

  @ApiProperty({
    description: 'ID do usuário que criou o pedido',
    example: 2,
  })
  @IsInt({ message: 'O ID do criador deve ser um número inteiro.' })
  @IsNotEmpty({ message: 'O ID do criador é obrigatório.' })
  createdById: number = 0;

  @ApiProperty({ description: 'Itens do pedido', type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[] = [];
}

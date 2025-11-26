import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsISO8601 } from 'class-validator';
import { PaymentMethod } from 'generated/prisma';
import { OrderStatus } from './create-order.dto';
import { PageableDto } from 'src/pagination/pageable.dto';

export class FindAllOrdersDto extends PageableDto {
  constructor(partial: Partial<FindAllOrdersDto>) {
    super();
    Object.assign(this, partial);
  }

  @ApiPropertyOptional({
    description: 'ID do cliente para filtrar pedidos',
    example: 1,
  })
  @IsInt({ message: 'O ID do cliente deve ser um número inteiro.' })
  @IsOptional()
  clientId?: number;

  @ApiPropertyOptional({
    description: 'Status do pedido para filtrar',
    example: OrderStatus.PENDING,
    enum: OrderStatus,
    isArray: true, // ✅ Permite múltiplos status
  })
  @IsEnum(OrderStatus, { message: 'Status do pedido inválido.', each: true })
  @IsOptional()
  status?: OrderStatus[];

  @ApiPropertyOptional({
    description: 'Forma de pagamento para filtrar',
    example: PaymentMethod.CREDIT,
    enum: PaymentMethod,
    isArray: true, // ✅ Permite múltiplas formas de pagamento
  })
  @IsEnum(PaymentMethod, { message: 'Forma de pagamento inválida.', each: true })
  @IsOptional()
  paymentMethod?: PaymentMethod[];

  @ApiPropertyOptional({
    description: 'Nome do cliente para busca parcial',
    example: 'João',
  })
  @IsOptional()
  searchName?: string;

  @ApiPropertyOptional({
    description: 'Data inicial para filtrar pedidos (inclusive)',
    example: '2025-01-01',
    type: String,
    format: 'date',
  })
  @IsISO8601({}, { message: 'Data inicial inválida (formato ISO 8601).' })
  @IsOptional()
  dateFrom?: string;

  @ApiPropertyOptional({
    description: 'Data final para filtrar pedidos (inclusive)',
    example: '2025-01-31',
    type: String,
    format: 'date',
  })
  @IsISO8601({}, { message: 'Data final inválida (formato ISO 8601).' })
  @IsOptional()
  dateTo?: string;
}

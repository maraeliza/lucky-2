import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderItemDto } from './create-orderitem.dto';

export class UpdateOrderitemDto extends PartialType(CreateOrderItemDto) {}

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { BaseController } from '../common/base.controller';
import { PageableDto, PageDto } from '../pagination/pageable.dto';
import { OrderItem } from 'generated/prisma';
import { CreateOrderItemDto } from './dto/create-orderitem.dto';
import { OrderItemService } from './orderitem.service';

class FindAllOrderItemsDto extends PageableDto {
  orderId?: number;
}

@ApiTags('OrderItems')
@Controller('order-items')
export class OrderItemController extends BaseController<
  OrderItem,
  CreateOrderItemDto,
  CreateOrderItemDto
> {
  constructor(private readonly orderItemService: OrderItemService) {
    super(orderItemService, 'OrderItem');
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Lista os itens dos pedidos de forma paginada',
    type: PageDto,
  })
  async findPagered(@Query() query: FindAllOrderItemsDto) {
    const { page, limit, ...filters } = query;
    return this.orderItemService.findPagered({ page, limit }, filters);
  }
}

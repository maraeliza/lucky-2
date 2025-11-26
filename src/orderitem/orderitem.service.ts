import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from 'src/common/base.service';
import { OrderItem } from 'generated/prisma';

@Injectable()
export class OrderItemService extends BaseService<
  OrderItem,
  PrismaService['orderItem']
> {
  constructor(prisma: PrismaService) {
    super(prisma, prisma.orderItem);
  }

  async findAllOrderItemsByOrder(orderId: number) {
    return this.findPagered({ page: 1, limit: 100 }, { orderId });
  }
}

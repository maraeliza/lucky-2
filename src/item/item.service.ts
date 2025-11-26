import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Item } from './entities/item.entity';
import { PageableDto } from '../pagination/pageable.dto';
import { BaseService } from '../common/base.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class ItemService extends BaseService<Item, PrismaService['item']> {
  constructor(prisma: PrismaService) {
    super(prisma, prisma.item);
  }

  async findAllItems(
    pageable: PageableDto,
    filters?: { description?: string; categoryId?: number },
  ) {
    const where = {
      description: filters?.description
        ? { contains: filters.description, mode: 'insensitive' }
        : undefined,
      categoryId: filters?.categoryId ?? undefined,
    };
    const include: Prisma.ItemInclude = {
      category: {
        select: {
          description: true,
          color: true,
          id: true
        },
      },
    };
    const orderBy: Prisma.Enumerable<any> = { id: 'asc' };
    return this.findPagered(pageable, where, orderBy, include);
  }
}

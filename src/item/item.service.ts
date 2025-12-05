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
    filters?: { description?: string; categoryId?: any },
  ) {
    const OR: any[] = [];

    if (filters?.description) {
      OR.push({
        description: {
          contains: filters.description,
          mode: 'insensitive',
        },
      });
    }

    if (filters?.categoryId) {
      const categoryIdNumber = Number(filters.categoryId);

      if (!isNaN(categoryIdNumber) && categoryIdNumber != 0) {
        OR.push({ categoryId: categoryIdNumber });
      }
    }

    const where = OR.length > 0 ? { OR } : {};

    const include: Prisma.ItemInclude = {
      category: {
        select: {
          description: true,
          color: true,
          id: true,
        },
      },
    };

    const orderBy = { id: 'asc' };

    return this.findPagered(pageable, where, orderBy, include);
  }
}

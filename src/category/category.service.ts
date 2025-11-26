import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from './entities/category.entity';
import { PageableDto } from '../pagination/pageable.dto';
import { BaseService } from 'src/common/base.service';

@Injectable()
export class CategoryService extends BaseService<
  Category,
  PrismaService['category']
> {
  constructor(prisma: PrismaService) {
    super(prisma, prisma.category);
  }
  async createCategory(data: { description: string; color?: string }) {
    const existing = await this.delegate.findUnique({
      where: { description: data.description },
    });

    if (existing) {
      throw new HttpException(
        { message: 'Já existe uma categoria com esse nome.' },
        HttpStatus.CONFLICT,
      );
    }

    return this.create(data);
  }

  async findAllCategories(
    pageable: PageableDto,
    filters?: { description?: string; color?: string },
  ) {
    const where = {
      description: filters?.description
        ? { contains: filters.description, mode: 'insensitive' }
        : undefined,
      color: filters?.color
        ? { contains: filters.color, mode: 'insensitive' }
        : undefined,
    };

    return this.findPagered(pageable, where);
  }
}

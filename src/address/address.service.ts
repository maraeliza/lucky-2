import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Address } from './entities/address.entity';
import { PageableDto } from 'src/pagination/pageable.dto';
import { AddressFilterDto } from './dto/filter-address.dto';
import { BaseService } from 'src/common/base.service';

@Injectable()
export class AddressService extends BaseService<
  Address,
  PrismaService['address']
> {
  constructor(prisma: PrismaService) {
    super(prisma, prisma.address);
  }

  async findAllAddresses(pageable: PageableDto, filters: AddressFilterDto) {
    const where = {
      street: filters.street
        ? { contains: filters.street, mode: 'insensitive' }
        : undefined,
      city: filters.city
        ? { contains: filters.city, mode: 'insensitive' }
        : undefined,
      state: filters.state ?? undefined,
    };

    return this.findPagered(pageable, where);
  }
}

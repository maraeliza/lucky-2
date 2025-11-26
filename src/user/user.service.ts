import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './entities/user.entity';
import { BaseService } from '../common/base.service';
import { PageableDto } from '../pagination/pageable.dto';
import { Prisma } from 'generated/prisma';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService extends BaseService<User, PrismaService['user']> {
  constructor(prisma: PrismaService) {
    super(prisma, prisma.user);
  }

  async findByEmail(email: string): Promise<User | null> {
    if (!email) return null;

    return this.delegate.findUnique({
      where: { email },
    });
  }

  async findAllUsers(pageable: PageableDto, filters?: { query?: string }) {
    const where = filters?.query
      ? {
          OR: [
            { name: { contains: filters.query, mode: 'insensitive' } },
            { phone: { contains: filters.query, mode: 'insensitive' } },
            { email: { contains: filters.query, mode: 'insensitive' } },
          ],
        }
      : {};

    const include = {
      address: {
        select: {
          street: true,
          number: true,
          district: true,
          city: true,
          state: true,
          zipCode: true,
        },
      },
    };

    const orderBy = { createdAt: 'desc' };

    return this.findPagered(pageable, where, orderBy, include);
  }

  async findUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        address: {
          select: {
            street: true,
            number: true,
            district: true,
            city: true,
            state: true,
            zipCode: true,
          },
        },
      },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      const data: Prisma.UserUpdateInput = {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        password: dto.password,
        ...(dto.address && {
          address: {
            update: {
              street: dto.address.street,
              number: dto.address.number,
              city: dto.address.city,
              state: dto.address.state,
              zipCode: dto.address.zipCode,
            },
          },
        }),
      };

      return this.prisma.user.update({
        where: { id },
        data,
        include: {
          address: true,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new HttpException(
          { message: 'Registro não encontrado para atualização.' },
          HttpStatus.NOT_FOUND,
        );
      }
      if (error.code === 'P2002') {
        throw new HttpException(
          { message: 'Conflito de dados ao atualizar registro.' },
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        {
          message:
            'Não foi possível atualizar o registro. Verifique os dados enviados.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

}

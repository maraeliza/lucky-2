import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Order } from './entities/order.entity';
import { PageableDto } from '../pagination/pageable.dto';
import { BaseService } from 'src/common/base.service';
import { PaymentMethod, Prisma } from 'generated/prisma';
import { CreateOrderDto, OrderStatus } from './dto/create-order.dto';

@Injectable()
export class OrderService extends BaseService<Order, PrismaService['order']> {
  constructor(prisma: PrismaService) {
    super(prisma, prisma.order);
  }

  async findAllOrders(
    pageable: PageableDto,
    filters?: {
      clientId?: number;
      status?: OrderStatus[];
      paymentMethod?: PaymentMethod[];
      searchName?: string;
      dateFrom?: string;
      dateTo?: string;
    },
  ) {
    const where: any = {};

    // Filtrar por cliente
    if (filters?.clientId) {
      where.clientId = filters.clientId;
    }

    // Filtrar por status (array)
    if (filters?.status && filters.status.length > 0) {
      where.status = { in: filters.status };
    }

    // Filtrar por forma de pagamento (array)
    if (filters?.paymentMethod && filters.paymentMethod.length > 0) {
      where.paymentMethod = { in: filters.paymentMethod };
    }

    // Filtrar por nome do cliente
    if (filters?.searchName) {
      where.client = {
        name: { contains: filters.searchName, mode: 'insensitive' },
      };
    }

    // Filtrar por datas
    if (filters?.dateFrom || filters?.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) {
        where.createdAt.gte = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        where.createdAt.lte = new Date(filters.dateTo);
      }
    }
    const include = {
      client: {
        select: {
          name: true,
          email: true,
          phone: true,
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
      },
      OrderItem: {
        select: {
          quantity: true,
          item: {
            select: {
              description: true,
              unitPrice: true,
            },
          },
        },
      },
    };

    return this.findPagered(pageable, where, { createdAt: 'desc' }, include);
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { clientId, paymentMethod, createdById, status, items } =
      createOrderDto;

    // Validação mínima do array items
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new HttpException(
        { message: 'O pedido deve conter ao menos um item.' },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const order = await this.delegate.create({
        data: {
          clientId,
          paymentMethod,
          status: status ?? OrderStatus.PENDING,
          createdById,
          OrderItem: {
            create: items.map((item) => ({
              itemId: item.itemId,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          OrderItem: true,
        },
      });

      return order;
    } catch (error: any) {
      console.error('Erro ao criar pedido:', error);

      if (error.code === 'P2002') {
        throw new HttpException(
          { message: 'Já existe um pedido com esses dados.' },
          HttpStatus.CONFLICT,
        );
      }

      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new HttpException(
          { message: 'Os dados enviados são inválidos ou estão incompletos.' },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (
        error instanceof Prisma.PrismaClientInitializationError ||
        error instanceof Prisma.PrismaClientRustPanicError
      ) {
        throw new HttpException(
          {
            message:
              'Erro interno do servidor ou de conexão com o banco de dados.',
          },
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      // Qualquer outro erro inesperado
      throw new HttpException(
        {
          message:
            'Não foi possível criar o pedido. Verifique os dados enviados.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async delete(where: any): Promise<void> {
    try {
      await this.prisma.$transaction([
        this.prisma.orderItem.deleteMany({ where: { orderId: where.id } }),
        this.prisma.order.delete({ where }),
      ]);
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new HttpException(
          { message: 'Pedido não encontrado para exclusão.' },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        { message: 'Erro ao excluir o pedido.', detail: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

import { Prisma, PrismaClient } from 'generated/prisma';
import { PageableDto, PageDto } from '../pagination/pageable.dto';
import { getPagination } from '../pagination/pagination.util';
import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseService<
  TModel,
  TDelegate extends {
    findUnique: Function;
    findMany: Function;
    create: Function;
    update: Function;
    delete: Function;
    count: Function;
  },
> {
  constructor(
    protected prisma: PrismaClient,
    protected delegate: TDelegate,
  ) {}

  async findPagered(
    pageable: PageableDto,
    where?: Prisma.Enumerable<any>,
    orderBy: Prisma.Enumerable<any> = { id: 'asc' },
    include?: any,
  ): Promise<PageDto<TModel>> {
    try {
      const { skip, take, page, limit } = getPagination(
        pageable.page,
        pageable.limit,
      );
      const findOptions: Prisma.ItemFindManyArgs = {
        where,
        skip,
        take,
        orderBy,
        ...(include && { include }),
      };
      const [data, total] = await Promise.all([
        this.delegate.findMany(findOptions),
        this.delegate.count({ where }),
      ]);

      return new PageDto<TModel>(data, {
        page,
        limit,
        total,
        lastPage: Math.ceil(total / limit),
      });
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new HttpException(
          { message: 'Filtro inválido', detail: error.message },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(
          {
            message: 'Erro ao consultar o banco de dados',
            detail: error.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (
        error instanceof Prisma.PrismaClientInitializationError ||
        error instanceof Prisma.PrismaClientRustPanicError
      ) {
        throw new HttpException(
          {
            message: 'Erro de conexão com o banco de dados',
            detail: error.message,
          },
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      throw new HttpException(
        { message: 'Erro ao buscar registros', detail: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(where: any): Promise<TModel> {
    try {
      const entity = await this.delegate.findUnique({ where });
      if (!entity) {
        throw new HttpException(
          { message: 'Registro não encontrado' },
          HttpStatus.NOT_FOUND,
        );
      }
      return entity;
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        { message: 'Erro ao buscar registro', detail: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findAll(): Promise<TModel[]> {
    try {
      const entities = await this.delegate.findMany();

      return entities;
    } catch (error: any) {
      throw new HttpException(
        {
          message: 'Erro ao buscar registros',
          detail: error?.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(data: any): Promise<TModel> {
    try {
      return await this.delegate.create({ data });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new HttpException(
          { message: 'Já existe um registro com esses dados' },
          HttpStatus.CONFLICT,
        );
      }
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new HttpException(
          { message: 'Dados inválidos enviados para criação do registro.' },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (
        error instanceof Prisma.PrismaClientInitializationError ||
        error instanceof Prisma.PrismaClientRustPanicError
      ) {
        throw new HttpException(
          { message: 'Erro de conexão com o banco de dados.' },
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      console.error('Erro ao criar registro:', error);
      throw new HttpException(
        {
          message:
            'Não foi possível criar o registro. Verifique os dados enviados.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(where: any, data: any): Promise<TModel> {
    try {
      const dataWithUpdated = { ...data, updatedAt: new Date() };
      return await this.delegate.update({ where, data: dataWithUpdated });
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

  async delete(where: any): Promise<void> {
    try {
      await this.delegate.delete({ where });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new HttpException(
          { message: 'Registro não encontrado para exclusão' },
          HttpStatus.NOT_FOUND,
        );
      }
      if (error.code === 'P2003') {
        throw new HttpException(
          {
            message:
              'Não é possível excluir este registro, pois ele está vinculado a outro item.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        { message: 'Erro ao deletar registro', detail: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

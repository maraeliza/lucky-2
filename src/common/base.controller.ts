import {
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Patch,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PageableDto } from '../pagination/pageable.dto';
import { BaseService } from './base.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

export class BaseController<TModel, TCreateDto = any, TUpdateDto = any> {
  constructor(
    protected readonly service: BaseService<TModel, any>,
    protected readonly entityName?: string,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findPagered(@Query() query: any) {
    const { page, limit, ...filters } = query;
    const pageable: PageableDto = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    };
    return this.service.findPagered(pageable, filters);
  }
  @Get('/all')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne({ id });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: TCreateDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async patch(@Param('id', ParseIntPipe) id: number, @Body() data: TUpdateDto) {
    return this.service.update({ id }, data);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: TUpdateDto,
  ) {
    return this.service.update({ id }, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.service.delete({ id });
  }
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max } from 'class-validator';

export class PageableDto {
  @ApiPropertyOptional({
    description: 'Número da página',
    default: 1,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Número de itens por página',
    default: 10,
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

export class PageMetaDto {
  @ApiProperty({ description: 'Página atual', example: 1 })
  page: number = 1;

  @ApiProperty({ description: 'Itens por página', example: 10 })
  limit: number = 10;

  @ApiProperty({ description: 'Total de itens', example: 100 })
  total: number = 0;

  @ApiProperty({ description: 'Última página', example: 10 })
  lastPage: number = 1;
}

export class PageDto<T> {
  @ApiProperty({ isArray: true, description: 'Lista de itens' })
  data: T[] = [];

  @ApiProperty({ type: PageMetaDto, description: 'Informações de paginação' })
  meta: PageMetaDto = new PageMetaDto();

  constructor(data: T[] = [], meta?: PageMetaDto) {
    this.data = data;
    this.meta = meta ?? new PageMetaDto();
  }
}

export function createPageDto<T>(classRef: new () => T) {
  class PageClass {
    @ApiProperty({
      isArray: true,
      type: classRef,
      description: 'Lista de itens',
    })
    data: T[] = [];

    @ApiProperty({ type: PageMetaDto, description: 'Informações de paginação' })
    meta: PageMetaDto = new PageMetaDto();

    constructor(data: T[] = [], meta?: PageMetaDto) {
      this.data = data;
      this.meta = meta ?? new PageMetaDto();
    }
  }
  return PageClass;
}

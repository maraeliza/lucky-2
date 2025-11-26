import {
  Query,
  Get,
  Controller,
  HttpCode,
  HttpStatus,
  UseGuards,
  Post,
  Body,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PageableDto } from '../pagination/pageable.dto';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { BaseController } from '../common/base.controller';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

class FindAllCategoriesDto extends PageableDto {
  constructor(partial: Partial<FindAllCategoriesDto>) {
    super();
    Object.assign(this, partial);
  }
  description?: string;
}
@ApiTags('Categories')
@Controller('categories')
export class CategoryController extends BaseController<
  Category,
  CreateCategoryDto,
  UpdateCategoryDto
> {
  constructor(private readonly categoryService: CategoryService) {
    super(categoryService, 'Category');
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Lista todas as categorias de forma paginada',
    summary: "Busca de categorias"
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Categoria buscada com sucesso.',
    type: CreateCategoryDto,
  })
  async findPagered(@Query() query: FindAllCategoriesDto) {
    const { page, limit, ...filters } = query;
    return this.categoryService.findAllCategories({ page, limit }, filters);
  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Cria uma nova categoria',
  })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }
}

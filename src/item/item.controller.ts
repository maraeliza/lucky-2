import { Query, Get, Controller, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PageableDto, PageDto } from '../pagination/pageable.dto';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { BaseController } from '../common/base.controller';
import { Item } from './entities/item.entity';

class FindAllItemsDto extends PageableDto {
  constructor(partial: Partial<FindAllItemsDto>) {
    super();
    Object.assign(this, partial);
  }
  description?: string;
  categoryId?: number;
}

@ApiTags('Items')
@Controller('items')
export class ItemController extends BaseController<
  Item,
  CreateItemDto,
  UpdateItemDto
> {
  constructor(private readonly itemService: ItemService) {
    super(itemService, 'Item');
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Lista todos os itens de forma paginada',
    type: PageDto,
  })
  async findPagered(@Query() query: FindAllItemsDto) {
    const { page, limit, ...filters } = query;
    return this.itemService.findAllItems({ page, limit }, filters);
  }
}

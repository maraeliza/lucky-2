import { Query, Get, Controller, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { PageableDto, PageDto } from '../pagination/pageable.dto';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { BaseController } from 'src/common/base.controller';

class FindAllAddressesDto extends PageableDto {
  constructor(partial: Partial<FindAllAddressesDto>) {
    super();
    Object.assign(this, partial);
  }
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

@Controller('addresses')
export class AddressController extends BaseController<CreateAddressDto> {
  constructor(private readonly addressService: AddressService) {
    super(addressService);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Listar endereços de forma paginada',
    type: PageDto,
  })
  async findPagered(@Query() query: FindAllAddressesDto) {
    const { page, limit, ...filters } = query;
    return this.addressService.findAllAddresses({ page, limit }, filters);
  }
}

import {
  Controller,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  Body,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { BaseController } from '../common/base.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PageDto } from '../pagination/pageable.dto';
import { FindAllUsersDto } from './dto/find-all-user.dto';

@ApiTags('Users')
@Controller('users')
export class UserController extends BaseController<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(private readonly userService: UserService) {
    super(userService, 'User');
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Lista todos os usuários de forma paginada',
    type: PageDto,
  })
  async findPagered(@Query() query: FindAllUsersDto) {
    const { page, limit, ...filters } = query;

    return this.userService.findAllUsers({ page, limit }, filters);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Retorna o usuário pelo ID (inclui endereço)',
    type: User,
  })
  async findUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findUserById(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
  ) {
    const user = await this.userService.update(id, data);

    return {
      id: user.id,
      name: user.name,
    };
  }
}

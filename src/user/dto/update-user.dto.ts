// src/user/dto/update-user.dto.ts
import { IsOptional, IsInt } from 'class-validator';
import { CreateAddressDto } from 'src/address/dto/create-address.dto';

export class UpdateUserDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  password?: string;

  @IsOptional()
  address?: CreateAddressDto;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({
    description: 'Nome da rua',
    example: 'Rua das Flores',
  })
  @IsString()
  @IsNotEmpty()
  street: string = '';

  @ApiProperty({
    description: 'Número do endereço',
    example: '123',
  })
  @IsString()
  @IsNotEmpty()
  number: string = '';

  @ApiProperty({
    description: 'Bairro do endereço',
    example: 'Centro',
  })
  @IsString()
  @IsNotEmpty()
  district: string = '';

  @ApiProperty({
    description: 'Cidade do endereço',
    example: 'São Paulo',
  })
  @IsString()
  @IsNotEmpty()
  city: string = '';

  @ApiProperty({
    description: 'Estado do endereço',
    example: 'SP',
  })
  @IsString()
  @IsNotEmpty()
  state: string = '';

  @ApiProperty({
    description: 'CEP do endereço',
    example: '01001-000',
  })
  @IsString()
  @IsNotEmpty()
  zipCode: string = '';
}

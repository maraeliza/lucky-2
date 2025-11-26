import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AddressFilterDto {
  @ApiPropertyOptional({ description: 'Filtrar pelo nome da rua' })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiPropertyOptional({ description: 'Filtrar pela cidade' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Filtrar pelo estado' })
  @IsOptional()
  @IsString()
  state?: string;
}

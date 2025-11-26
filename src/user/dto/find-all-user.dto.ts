import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FindAllUsersDto {
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page: number = 1;

  @IsInt()
  @Type(() => Number)
  @Min(1)
  limit: number = 10;

  @IsOptional()
  @IsString()
  query?: string;
}

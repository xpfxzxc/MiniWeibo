import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min, Max } from 'class-validator';

export class IndexUserDto {
  @Min(1)
  @IsInt()
  @Transform(value => parseInt(value, 10))
  @IsOptional()
  page: number;

  @Max(100)
  @Min(5)
  @IsInt()
  @Transform(value => parseInt(value, 10))
  @IsOptional()
  limit: number;
}

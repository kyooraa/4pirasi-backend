import { IsOptional, IsString } from 'class-validator';
import { BaseQueryDto } from 'src/shared/dto/base-query.dto';

export class FindAllKategoriDto extends BaseQueryDto {
  @IsString()
  @IsOptional()
  name?: string;
}

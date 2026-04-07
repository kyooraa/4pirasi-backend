import { IsBoolean, IsOptional } from 'class-validator';
import { BaseQueryDto } from 'src/shared/dto/base-query.dto';
import { type AspirasiStatus } from '../entities/aspirasi.entity';
import { Type } from 'class-transformer';

export class FindAllAspirasiDto extends BaseQueryDto {
  @IsOptional()
  status?: AspirasiStatus;

  @IsOptional()
  tanggal?: string;

  @IsOptional()
  tanggalSelesai?: string;

  @IsOptional()
  bulan?: number;

  @IsOptional()
  kategori?: string;

  @IsOptional()
  nama?: string;

  @IsOptional()
  keterangan?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isFeed?: boolean;
}

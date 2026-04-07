import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class FeedbackAspirasiDto {
  @IsString()
  @IsNotEmpty()
  keterangan!: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  idFeed!: number;

  @IsNumber()
  @IsNotEmpty()
  userId!: number;
}

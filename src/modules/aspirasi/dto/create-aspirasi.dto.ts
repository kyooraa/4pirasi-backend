import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAspirasiDto {
  @IsString()
  @IsNotEmpty()
  keterangan!: string;

  @IsString()
  @IsNotEmpty()
  lokasi!: string;

  @IsNumber()
  @IsNotEmpty()
  kategoriId!: number;

  @IsNumber()
  @IsNotEmpty()
  userId!: number;
}

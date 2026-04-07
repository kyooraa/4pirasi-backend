import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { type UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  kelas!: string;

  @IsString()
  @IsNotEmpty()
  nis!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsEnum(['admin', 'siswa'])
  @IsNotEmpty()
  role!: UserRole;
}

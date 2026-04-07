import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { username: dto.username },
    });

    if (existingUser) {
      return {
        message: 'Username sudah digunakan!',
      };
    }

    const existingEmail = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (existingEmail) {
      return {
        message: 'Email sudah digunakan!',
      };
    }
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    const user = this.userRepository.create({
      password: hashedPassword,
      role: dto.role,
      username: dto.username,
      email: dto.email,
      kelas: dto.kelas,
      nis: dto.nis,
      name: dto.name,
    });

    const savedUser = await this.userRepository.save(user);

    return {
      message: 'User berhasil didaftarkan!',
      data: savedUser,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { username: dto.username },
    });

    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, username: user.username, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

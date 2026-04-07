import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aspirasi } from './entities/aspirasi.entity';
import { AspirasiService } from './aspirasi.service';
import { AspirasiController } from './aspirasi.controller';
import { Kategori } from '../kategori/entities/kategori.entity';
import { User } from '../auth/entities/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Aspirasi, Kategori, User])],
  controllers: [AspirasiController],
  providers: [AspirasiService],
})
export class AspirasiModule {}

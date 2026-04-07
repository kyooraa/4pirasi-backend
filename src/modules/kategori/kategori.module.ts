import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kategori } from './entities/kategori.entity';
import { KategoriController } from './kategori.controller';
import { KategoriService } from './kategori.service';
@Module({
  imports: [TypeOrmModule.forFeature([Kategori])],
  controllers: [KategoriController],
  providers: [KategoriService],
})
export class KategoriModule {}

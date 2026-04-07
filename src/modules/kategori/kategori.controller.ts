import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { KategoriService } from './kategori.service';
import { CreateKategoriDto } from './dto/create-kategori.dto';
import { FindAllKategoriDto } from './dto/find-all-kategori.dto';
@Controller('api/kategori')
export class KategoriController {
  constructor(private readonly kategoriService: KategoriService) {}

  @Post()
  async create(@Body() dto: CreateKategoriDto) {
    return this.kategoriService.create(dto);
  }

  @Get()
  async findAll(@Query() query: FindAllKategoriDto) {
    return this.kategoriService.findAll(query);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.kategoriService.delete(id);
  }
}

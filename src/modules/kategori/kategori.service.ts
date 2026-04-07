import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Kategori } from './entities/kategori.entity';
import { CreateKategoriDto } from './dto/create-kategori.dto';
import { FindAllKategoriDto } from './dto/find-all-kategori.dto';
@Injectable()
export class KategoriService {
  constructor(
    @InjectRepository(Kategori)
    private readonly kategoriRepository: Repository<Kategori>,
  ) {}

  async create(dto: CreateKategoriDto) {
    const kategori = this.kategoriRepository.create(dto);
    const existingKategori = await this.kategoriRepository.findOne({
      where: { name: dto.name },
    });

    if (existingKategori) {
      throw new NotFoundException('Kategori dengan nama tersebut sudah ada!');
    }

    const savedKategori = await this.kategoriRepository.save(kategori);
    return {
      message: 'Kategori berhasil ditambahkan!',
      data: savedKategori,
    };
  }

  async findAll(query?: FindAllKategoriDto) {
    const qb = this.kategoriRepository.createQueryBuilder('kategori');

    if (query?.name) {
      qb.where('kategori.name ILIKE :name', { name: `%${query.name}%` });
    }

    let kategoris;
    let total;

    if (query?.limit === -1) {
      kategoris = await qb.getMany();
      total = kategoris.length;
    } else {
      const page = query?.page || 1;
      const limit = query?.limit || 10;

      [kategoris, total] = await qb
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();
    }

    return {
      message: 'Daftar kategori berhasil diambil!',
      data: kategoris,
      pagination: {
        page: query?.limit === -1 ? 1 : query?.page || 1,
        limit: query?.limit === -1 ? total : query?.limit || 10,
        total,
        totalPages:
          query?.limit === -1 ? 1 : Math.ceil(total / (query?.limit || 10)),
      },
    };
  }

  async delete(id: number) {
    const kategori = await this.kategoriRepository.findOne({ where: { id } });

    if (!kategori) {
      throw new NotFoundException('Kategori tidak ditemukan!');
    }

    await this.kategoriRepository.softDelete(id);

    return {
      message: 'Kategori berhasil dihapus!',
    };
  }
}

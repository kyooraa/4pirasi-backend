import { Injectable } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Aspirasi } from './entities/aspirasi.entity';
import { CreateAspirasiDto } from './dto/create-aspirasi.dto';
import { Kategori } from '../kategori/entities/kategori.entity';
import { User } from '../auth/entities/user.entity';
import { FindAllAspirasiDto } from './dto/find-all-aspirasi.dto';
import { FeedbackAspirasiDto } from './dto/feedback-aspirasi.dto';
@Injectable()
export class AspirasiService {
  constructor(
    @InjectRepository(Aspirasi)
    private readonly aspirasiRepository: Repository<Aspirasi>,

    @InjectRepository(Kategori)
    private readonly kategoriRepository: Repository<Kategori>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createAspirasi(dto: CreateAspirasiDto) {
    const kategori = await this.kategoriRepository.findOne({
      where: { id: dto.kategoriId },
    });

    if (!kategori) {
      return {
        message: 'Kategori tidak ditemukan!',
      };
    }

    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
    });

    if (!user) {
      return {
        message: 'User tidak ditemukan!',
      };
    }

    const aspirasi = this.aspirasiRepository.create({
      isFeedback: false,
      kategori,
      user,
      keterangan: dto.keterangan,
      lokasi: dto.lokasi,
      status: 'menunggu',
    });

    const savedAspirasi = await this.aspirasiRepository.save(aspirasi);

    return {
      message: 'Aspirasi berhasil dibuat!',
      data: savedAspirasi,
    };
  }

  async getAllAspirasi(query?: FindAllAspirasiDto) {
    const qb = this.aspirasiRepository.createQueryBuilder('aspirasi');
    qb.leftJoinAndSelect('aspirasi.kategori', 'kategori');
    qb.leftJoinAndSelect('aspirasi.user', 'user');

    if (query?.status) {
      qb.andWhere('aspirasi.status = :status', { status: query.status });
    }

    if (query?.tanggal) {
      qb.andWhere('DATE(aspirasi.created_at) = :tanggal', {
        tanggal: query.tanggal,
      });
    }

    if (query?.tanggalSelesai) {
      qb.andWhere(
        'DATE(aspirasi.updatedAt) = :tanggal AND aspirasi.status = :status',
        {
          tanggal: query.tanggalSelesai,
          status: 'selesai',
        },
      );
    }

    if (query?.bulan) {
      qb.andWhere('MONTH(aspirasi.created_at) = :bulan', {
        bulan: query.bulan,
      });
    }

    if (query?.kategori) {
      qb.andWhere('kategori.id = :kategori', { kategori: query.kategori });
    }

    if (query?.keterangan) {
      qb.andWhere('aspirasi.keterangan ILIKE :keterangan', {
        keterangan: `%${query.keterangan}%`,
      });
    }

    if (query?.nama) {
      qb.andWhere('user.username ILIKE :nama', { nama: `%${query.nama}%` });
    }

    if (query?.isFeed && query.isFeed == true) {
      qb.andWhere('aspirasi.is_feedback = :isFeed', { isFeed: false });
    }

    let aspirasis;
    let total;

    if (query?.limit === -1) {
      aspirasis = await qb.getMany();
      total = aspirasis.length;
    } else {
      const page = query?.page || 1;
      const limit = query?.limit || 10;

      [aspirasis, total] = await qb
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();
    }

    return {
      message: 'Aspirasi berhasil diambil!',
      data: aspirasis,
      pagination: {
        page: query?.limit === -1 ? 1 : query?.page || 1,
        limit: query?.limit === -1 ? total : query?.limit || 10,
        total,
        totalPages:
          query?.limit === -1 ? 1 : Math.ceil(total / (query?.limit || 10)),
      },
    };
  }

  async getByIdAspirasi(id: number) {
    const aspirasi = await this.aspirasiRepository.findOne({
      where: { id },
      relations: ['kategori', 'user'],
    });

    if (!aspirasi) {
      return {
        message: 'Aspirasi tidak ditemukan!',
      };
    }

    return {
      message: 'Aspirasi berhasil diambil!',
      data: aspirasi,
    };
  }

  async feedbackAspirasi(dto: FeedbackAspirasiDto) {
    const feed = await this.aspirasiRepository.findOne({
      where: { id: dto.idFeed },
    });

    if (!feed) {
      return {
        message: 'Feed awal tidak ditemukan!',
      };
    }

    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
    });

    if (!user) {
      return {
        message: 'User tidak ditemukan!',
      };
    }

    const aspirasi = this.aspirasiRepository.create({
      isFeedback: true,
      idFeed: dto.idFeed,
      kategoriId: feed.kategoriId,
      user,
      keterangan: dto.keterangan,
      status: 'selesai',
    });

    await this.aspirasiRepository.update(dto.idFeed, {
      status: 'selesai',
    });

    const savedAspirasi = await this.aspirasiRepository.save(aspirasi);

    return {
      message: 'Feedback aspirasi berhasil dibuat!',
      data: savedAspirasi,
    };
  }

  async getAspirasiInformations() {
    const monthly = await this.aspirasiThisMonth();
    const status = await this.statusAspirasi();

    return {
      message: 'Informasi mengenai aspirasi berhasil diambil!',
      data: {
        aspirasiThisMonth: {
          total: monthly.total,
          percentage: monthly.percentageChange,
        },
        status: {
          menunggu: status.menunggu,
          selesai: status.selesai,
        },
      },
    };
  }

  private async aspirasiThisMonth() {
    const now = new Date();

    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfCurrentMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
    );

    const total = await this.aspirasiRepository.count({
      where: {
        updatedAt: Between(startOfCurrentMonth, endOfCurrentMonth),
        isFeedback: false,
      },
    });

    const prevTotal = await this.aspirasiRepository.count({
      where: {
        updatedAt: Between(startOfPrevMonth, endOfPrevMonth),
        isFeedback: false,
      },
    });

    let percentageChange = 0;

    if (prevTotal > 0) {
      percentageChange = ((total - prevTotal) / prevTotal) * 100;
    } else if (total > 0) {
      percentageChange = 100;
    }

    return {
      total,
      percentageChange: Number(percentageChange.toFixed(2)),
    };
  }

  private async statusAspirasi() {
    const menunggu = await this.aspirasiRepository.count({
      where: { status: 'menunggu', isFeedback: false },
    });
    const selesai = await this.aspirasiRepository.count({
      where: { status: 'selesai', isFeedback: false },
    });

    return {
      menunggu,
      selesai,
    };
  }
}

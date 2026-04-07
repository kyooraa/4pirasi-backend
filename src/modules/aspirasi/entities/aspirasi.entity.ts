import { Kategori } from '../../kategori/entities/kategori.entity';
import { BaseEntity } from '../../../shared/dto/base-entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('aspirasis')
export class Aspirasi extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  keterangan!: string;

  @Column({ nullable: true })
  lokasi?: string;

  @Column({ type: 'enum', enum: ['menunggu', 'selesai'], default: 'menunggu' })
  status!: AspirasiStatus;

  @Column({ name: 'is_feedback', default: false })
  isFeedback!: boolean;

  @Column({ name: 'id_feed', nullable: true })
  idFeed?: number;

  @Column({ name: 'kategori_id' })
  kategoriId!: number;

  @ManyToOne(() => Kategori, (kategori) => kategori.aspirasis)
  @JoinColumn({ name: 'kategori_id' })
  kategori!: Kategori;

  @ManyToOne(() => User, (user) => user.aspirasis)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}

export type AspirasiStatus = 'menunggu' | 'selesai';

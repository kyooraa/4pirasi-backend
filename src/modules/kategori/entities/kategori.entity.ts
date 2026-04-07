import { Aspirasi } from '../../aspirasi/entities/aspirasi.entity';
import { BaseEntity } from '../../../shared/dto/base-entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('kategoris')
export class Kategori extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @OneToMany(() => Aspirasi, (aspirasi) => aspirasi.kategori)
  aspirasis!: Aspirasi[];
}

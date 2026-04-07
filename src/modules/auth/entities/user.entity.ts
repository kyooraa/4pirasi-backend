import { Aspirasi } from '../../aspirasi/entities/aspirasi.entity';
import { BaseEntity } from 'src/shared/dto/base-entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  kelas?: string;

  @Column()
  nis!: string;

  @Column()
  name!: string;

  @Column({ type: 'enum', enum: ['admin', 'siswa'] })
  role!: UserRole;

  @OneToMany(() => Aspirasi, (aspirasi) => aspirasi.user)
  aspirasis!: Aspirasi[];
}

export type UserRole = 'admin' | 'siswa';

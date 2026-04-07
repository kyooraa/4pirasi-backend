import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { postgreConfig } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { AspirasiModule } from './modules/aspirasi/aspirasi.module';
import { KategoriModule } from './modules/kategori/kategori.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(postgreConfig),
    AuthModule,
    AspirasiModule,
    KategoriModule,
  ],
})
export class AppModule {}

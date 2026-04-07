import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AspirasiService } from './aspirasi.service';
import { CreateAspirasiDto } from './dto/create-aspirasi.dto';
import { FindAllAspirasiDto } from './dto/find-all-aspirasi.dto';
import { FeedbackAspirasiDto } from './dto/feedback-aspirasi.dto';
@Controller('api/aspirasi')
export class AspirasiController {
  constructor(private readonly aspirasiService: AspirasiService) {}

  @Post()
  async createAspirasi(@Body() dto: CreateAspirasiDto) {
    return this.aspirasiService.createAspirasi(dto);
  }

  @Post('feedback')
  async feedbackAspirasi(@Body() dto: FeedbackAspirasiDto) {
    return this.aspirasiService.feedbackAspirasi(dto);
  }

  @Get()
  async getAllAspirasi(@Query() query: FindAllAspirasiDto) {
    return this.aspirasiService.getAllAspirasi(query);
  }

  @Get('dashboard')
  async getAspirasiInformations() {
    return this.aspirasiService.getAspirasiInformations();
  }

  @Get(':id')
  async getByIdAspirasi(@Param('id') id: number) {
    return this.aspirasiService.getByIdAspirasi(id);
  }
}

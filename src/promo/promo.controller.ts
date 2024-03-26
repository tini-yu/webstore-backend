import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Response,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiConsumes,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { PromoService } from './promo.service';
import { fileStorage } from './storage';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';
import { PromoEntity } from './entities/promo.entity';
import { DeleteResult } from 'typeorm';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('promo')
@Controller('promo')
export class PromoController {
  constructor(private readonly promoService: PromoService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Создать рекламу' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', { storage: fileStorage }))
  create(
    @Body() dto: CreatePromoDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<PromoEntity> {
    return this.promoService.create(dto, image);
  }

  @Get()
  @ApiOperation({ summary: 'Показать всю рекламу' })
  findAll() {
    return this.promoService.findAll();
  }

  @Get('/image/:path') //endpoint Передаем файл в виде ссылки
  @ApiOperation({ summary: 'Показать картинку по её названию' })
  download(@Param('path') path: string, @Response() response) {
    return response.sendFile(path, { root: './db_images/promo' });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Показать 1 рекламу' })
  findOne(@Param('id') id: string): Promise<PromoEntity> {
    return this.promoService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Изменить рекламу' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', { storage: fileStorage }))
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePromoDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<PromoEntity> {
    return this.promoService.update(+id, dto, image);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Удалить рекламу' })
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.promoService.delete(+id);
  }
}

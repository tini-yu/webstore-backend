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

import { ProductService } from './product.service';
import { fileStorage } from './storage';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { DeleteResult } from 'typeorm';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Добавить продукт' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', { storage: fileStorage }))
  create(
    @Body() dto: CreateProductDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<ProductEntity> {
    return this.productService.create(dto, image);
  }

  @Get('all')
  @ApiOperation({ summary: 'Показать все продукты' })
  findAll() {
    return this.productService.findAll();
  }

  @Get('category:id')
  @ApiOperation({ summary: 'Показать все продукты по категории' })
  findByCategoryId(@Param('id') id: string) {
    return this.productService.findByCategoryId(+id);
  }

  @Get('brand:id')
  @ApiOperation({ summary: 'Показать все продукты по бренду' })
  findBybrandId(@Param('id') id: string) {
    return this.productService.findByBrandId(+id);
  }

  @Get('/image/:path') //endpoint Передаем файл в виде ссылки
  @ApiOperation({ summary: 'Показать картинку по её названию в папке' })
  download(@Param('path') path: string, @Response() response) {
    return response.sendFile(path, { root: './db_images/product' });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Показать 1 продукт' })
  findOne(@Param('id') id: string): Promise<ProductEntity> {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Изменить продукт' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', { storage: fileStorage }))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<ProductEntity> {
    return this.productService.update(+id, dto, image);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Удалить продукт' })
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.productService.delete(+id);
  }
}

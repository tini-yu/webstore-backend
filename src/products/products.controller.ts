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
} from '@nestjs/common';
import { ApiTags, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { ProductsService } from './products.service';
import { fileStorage } from './storage';
import { CreateProductsDto } from './dto/create-products.dto';
import { UpdateProductsDto } from './dto/update-products.dto';
import { ProductsEntity } from './entities/products.entity';
import { DeleteResult } from 'typeorm';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', { storage: fileStorage }))
  create(
    @Body() dto: CreateProductsDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<ProductsEntity> {
    return this.productsService.create(dto, image);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('/image/:path') //endpoint Передаем файл в виде ссылки
  download(@Param('path') path: string, @Response() response) {
    return response.sendFile(path, { root: './db_images/products' });
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ProductsEntity> {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', { storage: fileStorage }))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductsDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<ProductsEntity> {
    return this.productsService.update(+id, dto, image);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.productsService.delete(+id);
  }
}

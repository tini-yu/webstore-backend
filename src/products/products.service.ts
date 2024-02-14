import { BadRequestException, Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';

import { CreateProductsDto } from './dto/create-products.dto';
import { UpdateProductsDto } from './dto/update-products.dto';
import { ProductsEntity } from './entities/products.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductsEntity)
    private repository: Repository<ProductsEntity>,
  ) {}

  async create(
    dto: CreateProductsDto,
    image: Express.Multer.File,
  ): Promise<ProductsEntity> {
    return this.repository.save({
      image: image.filename,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      crossedPrice: dto.crossedPrice,
    });
  }

  async findAll(): Promise<ProductsEntity[]> {
    return this.repository.find();
  }

  async findOne(id: number): Promise<ProductsEntity> {
    return this.repository.findOneBy({ id });
  }

  async update(id: number, dto: UpdateProductsDto, image: Express.Multer.File) {
    const toUpdate = await this.repository.findOneBy({ id });
    if (!toUpdate) {
      throw new BadRequestException(`Записи с id=${id} не найдено`);
    }
    if (dto.description) {
      toUpdate.description = dto.description;
    }
    if (dto.name) {
      toUpdate.name = dto.name;
    }
    if (image) {
      if (toUpdate.image !== image.filename) {
        fs.unlink(`db_images/products/${toUpdate.image}`, (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
      toUpdate.image = image.filename;
    }
    return this.repository.save(toUpdate);
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.repository.delete(id);
  }
}

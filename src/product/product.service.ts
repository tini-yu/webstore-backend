import { BadRequestException, Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { BrandEntity } from 'src/brand/entities/brand.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,

    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,

    @InjectRepository(BrandEntity)
    private brandRepository: Repository<BrandEntity>,
  ) {}

  async create(
    dto: CreateProductDto,
    image: Express.Multer.File, // adds image to folder even if request doesnt come through
  ): Promise<ProductEntity> {
    const product = new ProductEntity();

    const category = await this.categoryRepository.findOne({
      where: { id: dto.categoryId },
      relations: ['product'],
    });
    if (!category) {
      throw new BadRequestException(
        `Категории с id=${dto.categoryId} не найдено`,
      );
    }
    const brand = await this.brandRepository.findOne({
      where: { id: dto.brandId },
      relations: ['product'],
    });
    if (!brand) {
      throw new BadRequestException(`Бренда с id=${dto.brandId} не найдено`);
    }
    product.image = image.filename;
    product.name = dto.name;
    product.description = dto.description;
    product.price = dto.price;
    product.crossedPrice = dto.crossedPrice;

    const newProduct = await this.productRepository.save(product);

    category.product.push(product);
    brand.product.push(product);

    await this.categoryRepository.save(category);
    await this.brandRepository.save(brand);

    return newProduct;
  }

  async findAll(): Promise<ProductEntity[]> {
    return this.productRepository.find();
  }

  async findOne(id: number): Promise<ProductEntity> {
    return this.productRepository.findOneBy({ id });
  }

  async findByCategoryId(categoryId: number): Promise<ProductEntity[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.categoryId = :categoryId', { categoryId })
      .getMany();
  }

  async findByBrandId(brandId: number): Promise<ProductEntity[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.brand', 'brand')
      .where('product.brandId = :brandId', { brandId })
      .getMany();
  }

  async update(
    id: number,
    dto: UpdateProductDto,
    image: Express.Multer.File,
  ): Promise<ProductEntity> {
    const toUpdate = await this.productRepository.findOneBy({ id });
    if (!toUpdate) {
      throw new BadRequestException(`Записи с id=${id} не найдено`);
    }
    if (dto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: dto.categoryId },
        relations: ['product'],
      });
      if (!category) {
        throw new BadRequestException(
          `Категории с id=${dto.categoryId} не найдено`,
        );
      }
      toUpdate.category = category;
    }
    if (dto.brandId) {
      const brand = await this.brandRepository.findOne({
        where: { id: dto.brandId },
        relations: ['product'],
      });
      if (!brand) {
        throw new BadRequestException(`Бренда с id=${dto.brandId} не найдено`);
      }
      toUpdate.brand = brand;
    }
    if (dto.name) toUpdate.name = dto.name;
    if (dto.description) toUpdate.description = dto.description;
    if (dto.price) toUpdate.price = dto.price;
    if (dto.crossedPrice) toUpdate.crossedPrice = dto.crossedPrice;
    if (image) {
      if (toUpdate.image !== image.filename) {
        fs.unlink(`db_images/product/${toUpdate.image}`, (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
      toUpdate.image = image.filename;
    }

    return this.productRepository.save(toUpdate);
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.productRepository.delete(id);
  }
}

import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { ProductService } from 'src/product/product.service';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { BrandEntity } from 'src/brand/entities/brand.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CartEntity,
      ProductEntity,
      UserEntity,
      CategoryEntity,
      BrandEntity,
    ]),
  ],
  controllers: [CartController],
  providers: [CartService, ProductService],
})
export class CartModule {}

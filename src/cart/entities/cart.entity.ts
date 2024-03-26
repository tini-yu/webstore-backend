import { ApiHideProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { ProductEntity } from 'src/product/entities/product.entity';

@Entity('cart')
export class CartEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total: number;
  //total for one product

  @Column()
  quantity: number;

  @ApiHideProperty()
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  user: UserEntity;

  @ApiHideProperty()
  @ManyToOne(() => ProductEntity, (product) => product.id)
  @JoinColumn()
  product: ProductEntity;
}

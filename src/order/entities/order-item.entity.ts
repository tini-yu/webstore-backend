//здесь хранится уже оформленная копия корзины. например чтобы в истории заказов можно было найти.
// При этом очистив корзину мы ничего не теряем.
// +- то же что и в корзине
// доп ссылка на order
// можно пока не парится о синхронизации с корзиной (если меняется корзина - должен менятся и ордер)

import { ApiHideProperty } from '@nestjs/swagger';
import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderEntity } from './order.entity';

export class OrderItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiHideProperty()
  @ManyToOne(() => OrderEntity, (order) => order.id)
  @JoinColumn()
  order: OrderEntity;

  @Column()
  total: number;
  //total for one product

  @Column()
  quantity: number;

  @Column()
  userId: number;

  @Column()
  productId: number;
}

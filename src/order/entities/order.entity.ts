import { ApiHideProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItemEntity } from './order-item.entity';

export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiHideProperty()
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  user: UserEntity;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  @IsOptional()
  patronym: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  email: string;

  @Column()
  payment: string;

  @Column()
  totalPrice: number;

  @ApiHideProperty()
  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.id)
  @JoinColumn()
  orderItem: OrderItemEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}

// Колонки username, ФИО, телефон, емейл, адрес, способ оплаты (пока текстом отправлять как заглушку)
//one to many -> OrderItemEntity
// items: OrderItemEntity[] - тут каждый предмет который был в корзине
//totalPrice - сумма ВСЕГО заказа

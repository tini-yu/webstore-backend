import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/orderItem.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private orderItemRepository: Repository<OrderItemEntity>,
  ) {}

  async create(userId: number, dto: CreateOrderDto) {
    const order = new OrderEntity();

    order.name = dto.name;
    order.surname = dto.surname;
    order.patronym = dto.patronym;
    order.phone = dto.phone;
    order.email = dto.email;
    order.address = dto.address;
    order.payment = dto.payment;
    const authUser = await this.userRepository.findOne({
      where: { id: userId },
    });
    order.user = authUser;

    const userCart = await this.cartRepository.find({
      relations: ['user'],
    });

    const orderItem = userCart.filter((item) => item.user.id === userId);

    this.orderItemRepository.save(orderItem);

    return await this.cartRepository.save(order);
  }

  // findAll() {
  //   return `This action returns all order`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} order`;
  // }

  // update(id: number, updateOrderDto: UpdateOrderDto) {
  //   return `This action updates a #${id} order`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} order`;
  // }
}

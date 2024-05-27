import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { DeleteResult, Repository } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { ProductEntity } from 'src/product/entities/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  async addToCart(dto: CreateCartDto, userId: number): Promise<any> {
    const cartItems = await this.cartRepository.find({
      relations: ['product', 'user'],
    });
    const product = await this.productRepository.findOne({
      where: { id: dto.productId },
    });
    const authUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!product) {
      throw new BadRequestException(
        `Продукта с id=${dto.productId} не найдено`,
      );
    }
    if (product) {
      //confirm if user has item in cart
      const cart = cartItems.filter(
        (item) => item.product.id === dto.productId && item.user.id === userId,
      );
      //if doesn't:
      if (cart.length < 1) {
        const quantity = dto.quantity;
        const newItem = this.cartRepository.create({
          total: product.price * quantity,
          quantity,
        });
        newItem.user = authUser;
        newItem.product = product;

        return await this.cartRepository.save(newItem);
      } else {
        //Update the item quantity
        const quantity = (cart[0].quantity += dto.quantity);
        const total = product.price * quantity;

        return await this.cartRepository.update(cart[0].id, {
          quantity,
          total,
        });
      }
    }
  }

  async getItemsInCart(userId: number): Promise<CartEntity[]> {
    const userCart = await this.cartRepository.find({
      relations: ['product', 'user'],
    });
    return (await userCart).filter((item) => item.user.id === userId);
  }

  async remove(cartItemId: number, userId: number): Promise<DeleteResult> {
    const cartItems = await this.cartRepository.find({
      relations: ['product', 'user'],
      where: { id: cartItemId },
    });
    const cart = cartItems.filter(
      (item) => item.user.id === userId && item.id === cartItemId,
    );
    if (cart.length > 0) return this.cartRepository.delete(cartItemId);
    else {
      throw new BadRequestException(
        `Продукта в корзине с id=${cartItemId} не найдено`,
      );
    }
  }

  async reduceByOne(itemId: number, userId: number): Promise<any> {
    const cartItems = await this.cartRepository.find({
      relations: ['product', 'user'],
      where: { id: itemId },
    });

    const cart = cartItems.filter(
      (item) => item.user.id === userId && item.id === itemId,
    );

    if (cart.length > 0) {
      const product = cart[0].product;
      const quantity = cart[0].quantity - 1;
      const total = product.price * quantity;

      if (quantity == 0) {
        return this.cartRepository.delete(itemId);
      } else {
        return await this.cartRepository.update(cart[0].id, {
          quantity,
          total,
        });
      }
    } else {
      throw new BadRequestException(
        `Позиции в корзине с id=${itemId} не существует`,
      );
    }
  }
}

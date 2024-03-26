import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserId } from '../decorators/user-id.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Добавить товар в корзину' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(@Body() createCartDto: CreateCartDto, @UserId() userId: number) {
    return this.cartService.addToCart(createCartDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Показать всю корзину' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  findAll(@UserId() userId: number) {
    return this.cartService.getItemsInCart(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Уменьшить кол-во товара в корзине на 1' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  reduce(@Param('id') id: string, @UserId() userId: number) {
    return this.cartService.reduceByOne(+id, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить товар из корзины' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @UserId() userId: number) {
    return this.cartService.remove(+id, userId);
  }
}

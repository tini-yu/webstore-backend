import { IsNumber, IsPositive } from 'class-validator';

export class CreateCartDto {
  @IsPositive()
  quantity: number;

  @IsNumber()
  productId: number;
}

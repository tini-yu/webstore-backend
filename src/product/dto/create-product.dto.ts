/* eslint-disable @typescript-eslint/no-inferrable-types */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumberString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    type: 'file',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
    },
  })
  image: Express.Multer.File;

  @IsString()
  name: string = 'Название продукта';

  @IsString()
  description: string = 'Описание продукта';

  @IsNumberString()
  price: number;

  @ApiPropertyOptional({
    description: 'Цена до скидки',
  })
  @IsOptional()
  crossedPrice: number | null;

  @IsNumberString()
  categoryId: number;

  @ApiPropertyOptional()
  @IsNumberString()
  brandId: number;
}

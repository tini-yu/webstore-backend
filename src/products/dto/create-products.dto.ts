/* eslint-disable @typescript-eslint/no-inferrable-types */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumberString } from 'class-validator';

export class CreateProductsDto {
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
    description: 'Old price',
  })
  @IsOptional()
  crossedPrice: number | null;

  @IsNumberString()
  categoryId: number;
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandEntity } from './entities/brand.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(BrandEntity)
    private repository: Repository<BrandEntity>,
  ) {} //Подключение к базе данных

  create(createBrandDto: CreateBrandDto) {
    return this.repository.save(createBrandDto);
  }

  findAll() {
    Promise<BrandEntity[]>;
    return this.repository.find();
  }

  async findOne(id: number): Promise<BrandEntity | null> {
    return this.repository.findOneBy({ id }); //Не учитывает кол-во id всего
  }

  async update(id: number, dto: UpdateBrandDto) {
    const toUpdate = await this.repository.findOneBy({ id });
    if (!toUpdate) {
      //doesn't exist
      throw new BadRequestException(`Запись с id=${id} не найдена`);
    }
    if (dto.name) {
      //column exist
      toUpdate.name = dto.name;
    }
    return this.repository.save(toUpdate);
  }

  async remove(id: string) {
    return this.repository.delete(id);
  }
}

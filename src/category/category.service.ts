import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private repository: Repository<CategoryEntity>,
  ) {} //Подключение к базе данных

  create(createCategoryDto: CreateCategoryDto) {
    return this.repository.save(createCategoryDto);
  }

  findAll() {
    Promise<CategoryEntity[]>;
    return this.repository.find();
  }

  async findOne(id: number): Promise<CategoryEntity | null> {
    return this.repository.findOneBy({ id }); //Не учитывает кол-во id всего
  }

  async update(id: number, dto: UpdateCategoryDto) {
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

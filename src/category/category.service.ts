import { Injectable } from '@nestjs/common';
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

  findOne(id: number): Promise<CategoryEntity | null> {
    return this.repository.findOneBy({ id }); //Не учитывает кол-во id всего
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.repository.update(id, updateCategoryDto);
    //return `This action updates a #${id} category`;
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

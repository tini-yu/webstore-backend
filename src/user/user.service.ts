import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UpdateUsernameDto } from './dto/update-username.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  async create(dto: CreateUserDto) {
    const existingUser = await this.findByUsername(dto.username);

    if (existingUser) {
      throw new BadRequestException(
        `Пользователь ${dto.username} уже существует`,
      );
    }

    return this.repository.save(dto);
  }

  async findByUsername(username: string) {
    return this.repository.findOneBy({ username });
  }

  async findById(id: number) {
    return this.repository.findOneBy({ id });
  }

  async updateUsername(id: number, dto: UpdateUsernameDto) {
    const toUpdate = await this.repository.findOneBy({ id });
    const existingUser = await this.findByUsername(dto.username);

    if (existingUser) {
      throw new BadRequestException(
        `Пользователь ${dto.username} уже существует`,
      );
    }
    if (!toUpdate) {
      //doesn't exist
      throw new BadRequestException(`Юзер с id=${id} не найден`);
    }
    if (dto.username) {
      //column exist
      toUpdate.username = dto.username;
    }
    return this.repository.save(toUpdate);
  }

  async updatePassword(id: number, dto: UpdatePasswordDto) {
    const toUpdate = await this.repository.findOneBy({ id });
    if (!toUpdate) {
      //doesn't exist
      throw new BadRequestException(`Юзер с id=${id} не найдена`);
    }
    if (dto.password) {
      //column exist
      toUpdate.password = dto.password;
    }
    return this.repository.save(toUpdate);
  }
}

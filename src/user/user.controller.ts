import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UserId } from '../decorators/user-id.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.UserService.create(createUserDto);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getMe(@UserId() id: number) {
    return this.UserService.findById(id);
  }

  //@Patch('change password')
}

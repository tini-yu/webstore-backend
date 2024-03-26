import { Controller, Get, Post, Body, UseGuards, Patch } from '@nestjs/common';
import { UserId } from '../decorators/user-id.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UpdateUsernameDto } from './dto/update-username.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Создать юзера' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.UserService.create(createUserDto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Показать текущего юзера' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getMe(@UserId() id: number) {
    return this.UserService.findById(id);
  }

  @Patch('username')
  @ApiOperation({ summary: 'Обновить username' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  updateUsername(
    @UserId() id: string,
    @Body() updateUsernameDto: UpdateUsernameDto,
  ) {
    return this.UserService.updateUsername(+id, updateUsernameDto);
  }

  @Patch('password')
  @ApiOperation({ summary: 'Обновить password' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  updatePassword(
    @UserId() id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.UserService.updatePassword(+id, updatePasswordDto);
  }
}

import {
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Headers,
  Body,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth-jwt.guard';
import { SubUserDto } from './dto/user-subscribe.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/user')
  // @UsePipes(ValidationPipe)
  getUser(@Headers('authorization') accsesToken: string) {
    return this.usersService.getUsers(accsesToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/subscribe')
  @UsePipes(ValidationPipe)
  subscribe(
    @Headers('authorization') accsesToken: string,
    @Body() subUserDto: SubUserDto,
  ) {
    return this.usersService.subscribe(accsesToken, subUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/unsubscribe')
  @UsePipes(ValidationPipe)
  unSubscribe(
    @Headers('authorization') accsesToken: string,
    @Body() subUserDto: SubUserDto,
  ) {
    return this.usersService.unSubscribe(accsesToken, subUserDto);
  }
}

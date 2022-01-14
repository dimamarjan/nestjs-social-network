import {
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Headers,
  Body,
  Delete,
  Get,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/auth-jwt.guard';
import { SubUserDto } from './dto/user-subscribe.dto';
import { UsersService } from './users.service';

@ApiTags('Subscribe operations')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/user')
  @UsePipes(ValidationPipe)
  getUser(@Headers('authorization') accsesToken: string) {
    return this.usersService.getMyPage(accsesToken);
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
  @Post('/subscribe/:id/accept')
  @UsePipes(ValidationPipe)
  subscribeAccept(
    @Headers('authorization') accsesToken: string,
    @Param('id') subRequestId: string,
  ) {
    return this.usersService.subscribeAccept(accsesToken, subRequestId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/subscribe/:id/reject')
  @UsePipes(ValidationPipe)
  subscribeReject(
    @Headers('authorization') accsesToken: string,
    @Param('id') subRequestId: string,
  ) {
    return this.usersService.subscribeReject(accsesToken, subRequestId);
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

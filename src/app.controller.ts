import {
  Controller,
  Get,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Headers,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/auth-jwt.guard';

@ApiTags('Main newsline')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/postline')
  @UsePipes(ValidationPipe)
  getPostsLine(@Headers('authorization') accsesToken: string) {
    return this.appService.showPostsLine(accsesToken);
  }
}

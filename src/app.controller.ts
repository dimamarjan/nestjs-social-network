import {
  Controller,
  Get,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Headers,
} from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/auth-jwt.guard';

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

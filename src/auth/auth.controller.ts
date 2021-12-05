import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GoogleUsersDto } from './dto/user-google.dto';
import { LoginUsersDto } from './dto/user-login.dto';
import { ValidationPipe } from '../pipes/validation.pipe';
import { RegistrationUsersDto } from './dto/user-registration.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @UsePipes(ValidationPipe)
  login(@Body() loginUsersDto: LoginUsersDto) {
    return this.authService.login(loginUsersDto);
  }

  @Post('/reg')
  @UsePipes(ValidationPipe)
  registration(@Body() registrationUsersDto: RegistrationUsersDto) {
    return this.authService.registration(registrationUsersDto);
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async googleAuth(@Req() req: any) {
    return;
  }

  @Get('/redirect')
  @UseGuards(AuthGuard('google')) // for redirection from google form
  googleAuthRedirect(@Req() req: any) {
    const user: GoogleUsersDto = req.user;
    return this.authService.googleLogin(user);
  }
}

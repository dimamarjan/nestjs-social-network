import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GoogleUsersDto } from './dto/user-google.dto';
import { UsersService } from '../users/users.service';
import { CreateUsersDto } from './dto/user-create.dto';
import * as bcrypt from 'bcryptjs';
import { LoginUsersDto } from './dto/user-login.dto';
import { NewUsersDto } from './dto/user-new.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async googleLogin(googleUserDto: GoogleUsersDto) {
    if (!googleUserDto) {
      throw new UnauthorizedException('No such google user...');
    }
    const user: NewUsersDto = await this.usersService.findUserByEmail(
      googleUserDto.email,
    );
    if (user) {
      if (user.authType === 'google') {
        const token = await this.generateToken(user);
        return {
          token,
        };
      }
      throw new UnauthorizedException('Wrong authorization mthod');
    }
    const newUsersDto: NewUsersDto = await this.usersService.createUsers({
      ...googleUserDto,
      authType: 'google',
    });
    const token = await this.generateToken(newUsersDto);
    return {
      token,
      userId: newUsersDto.userId,
      email: newUsersDto.email,
      firstName: newUsersDto.firstName,
    };
  }

  async registration(createUsersDto: CreateUsersDto) {
    const user = await this.usersService.findUserByEmail(createUsersDto.email);
    if (user) {
      throw new HttpException('this email alredy used', HttpStatus.BAD_REQUEST);
    }
    const hashUserPaswd = await bcrypt.hash(
      createUsersDto.password,
      Number(process.env.BCRYPT_SALT),
    );
    const newUsersDto: NewUsersDto = await this.usersService.createUsers({
      ...createUsersDto,
      password: hashUserPaswd,
      authType: 'home',
    });
    const token = await this.generateToken(newUsersDto);
    return {
      token,
      userId: newUsersDto.userId,
      email: newUsersDto.email,
      firstName: newUsersDto.firstName,
    };
  }

  async login(loginUsersDto: LoginUsersDto) {
    try {
      const user = await this.userValidation(loginUsersDto);
      const token = await this.generateToken(user);
      return { token };
    } catch (error) {
      return error;
    }
  }

  private async generateToken(newUsersDto: NewUsersDto) {
    const { userId, email, password } = newUsersDto;
    if (password) {
      const token: string = this.jwtService.sign({ userId, email, password });
      return token;
    }
    const token: string = this.jwtService.sign({ userId, email });
    return token;
  }

  private async userValidation(loginUsersDto: LoginUsersDto) {
    const user = await this.usersService.findUserByEmail(loginUsersDto.email);
    if (user) {
      if (user.authType === 'home') {
        const paswdValidation = await bcrypt.compare(
          loginUsersDto.password,
          user.password,
        );
        if (user && paswdValidation) {
          return user;
        }
      }
    }
    throw new HttpException('login or password error', HttpStatus.UNAUTHORIZED);
  }
}

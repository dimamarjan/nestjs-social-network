import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUsersDto } from '../auth/dto/user-create.dto';
import { UserIdDto } from '../posts/dto/post-user-id.dto';
import { Users } from './models/users.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users) private usersRepository: typeof Users) {}

  async createUsers(createUserDto: CreateUsersDto) {
    return await this.usersRepository.create(createUserDto);
  }

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }

  async findUserById(user: UserIdDto) {
    return await this.usersRepository.findOne({
      where: user,
    });
  }
}

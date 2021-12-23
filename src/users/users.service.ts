import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TokenHeandlerService } from '../common/services/token-heandker.service';
import { CreateUsersDto } from '../auth/dto/user-create.dto';
import { UserIdDto } from '../posts/dto/post-user-id.dto';
import { Users } from './models/users.model';
import { SubUserDto } from './dto/user-subscribe.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users) private usersRepository: typeof Users,
    private tokenHeandlerService: TokenHeandlerService,
  ) {}

  async createUsers(createUserDto: CreateUsersDto) {
    return await this.usersRepository.create(createUserDto);
  }

  async subscribe(accsesToken: string, subUserDto: SubUserDto) {
    try {
      const reqUserId = this.tokenHeandlerService.getUserId(accsesToken);
      const user = await this.usersRepository.findOne({
        where: { userId: reqUserId },
      });
      const subUser = await this.usersRepository.findOne({
        where: { userId: subUserDto.userId },
      });
      if (user && subUser) {
        if (user.subscribes.length === 0 && subUser.folovers.length === 0) {
          user.subscribes = [subUserDto.userId];
          subUser.folovers = [reqUserId];
          await user.save();
          await subUser.save();
          return {
            message: `You successfully subscribed to ${subUser.firstName} newsletter`,
          };
        }
        if (
          !user.subscribes.includes(subUserDto.userId) &&
          !subUser.folovers.includes(reqUserId)
        ) {
          user.subscribes.push(subUserDto.userId);
          subUser.folovers.push(reqUserId);
          await user.save();
          await subUser.save();
          return {
            message: `You successfully subscribed to ${subUser.firstName} newsletter`,
          };
        }
        throw new HttpException(
          'User allredy subscribed',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException('User not found..', HttpStatus.BAD_REQUEST);
    } catch (error) {
      return error;
    }
  }

  async unSubscribe(accsesToken: string, subUserDto: SubUserDto) {
    try {
      const reqUserId = this.tokenHeandlerService.getUserId(accsesToken);
      const user = await this.usersRepository.findOne({
        where: { userId: reqUserId },
      });
      const subUser = await this.usersRepository.findOne({
        where: { userId: subUserDto.userId },
      });
      if (user && subUser) {
        if (
          user.subscribes.includes(subUserDto.userId) &&
          subUser.folovers.includes(reqUserId)
        ) {
          const newSubList = user.subscribes.filter(
            (user) => user !== subUserDto.userId,
          );
          const newFoloverList = subUser.folovers.filter(
            (user) => user !== reqUserId,
          );
          user.subscribes = newSubList;
          subUser.folovers = newFoloverList;
          await user.save();
          await subUser.save();
          return {
            message: `You successfully unsubscribed from ${subUser.firstName} newsletter`,
          };
        }
        throw new HttpException(
          'No subscription on this user',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException('User not found..', HttpStatus.BAD_REQUEST);
    } catch (error) {
      return error;
    }
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

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TokenHeandlerService } from '../common/services/token-heandker.service';
import { CreateUsersDto } from '../auth/dto/user-create.dto';
import { UserIdDto } from '../posts/dto/post-user-id.dto';
import { Users } from './models/users.model';
import { SubUserDto } from './dto/user-subscribe.dto';
import { UsersSubscribers } from './models/users-subscribers.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users) private usersRepository: typeof Users,
    @InjectModel(UsersSubscribers)
    private usersSubscribersRepository: typeof UsersSubscribers,
    private tokenHeandlerService: TokenHeandlerService,
  ) {}

  async getUsers(accsesToken: string) {
    const reqUserId = this.tokenHeandlerService.getUserId(accsesToken);
    return await this.usersRepository.findOne({
      where: { userId: reqUserId },
      include: { all: true },
    });
  }

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
        const getUserSubs = await user.$get('subscriber', { raw: true });
        const arrSubs = getUserSubs.map((sub) => sub.folover);
        if (arrSubs.includes(user.userId)) {
          throw new HttpException(
            'You already subscribed to user',
            HttpStatus.BAD_REQUEST,
          );
        }
        const subscribeRecord = await this.usersSubscribersRepository.create();
        await subscribeRecord.$set('subscriber', user);
        await subscribeRecord.update({
          userId: subUser.userId,
        });
        return {
          message: `You successfully subscribed to ${subUser.firstName} ${subUser.lastName} newsletter`,
        };
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
        const subscribeRecord = await this.usersSubscribersRepository.findOne({
          where: {
            folover: user.userId,
            userId: subUser.userId,
          },
        });
        if (subscribeRecord) {
          await subscribeRecord.destroy();
          return {
            message: `You successfully unsubscribed from ${subUser.firstName} ${subUser.lastName} newsletter`,
          };
        }
        throw new HttpException(
          'You already unsubscribed from user',
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

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TokenHeandlerService } from '../common/services/token-heandker.service';
import { CreateUsersDto } from '../auth/dto/user-create.dto';
import { UserIdDto } from '../posts/dto/post-user-id.dto';
import { Users } from './models/users.model';
import { SubUserDto } from './dto/user-subscribe.dto';
import { UsersSubscribers } from './models/users-subscribers.model';
import { UsersFolovers } from './models/users-folovers.model';
import { SubscribeRequests } from './models/users-subscribe-requests.model';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users) private usersRepository: typeof Users,
    @InjectModel(UsersSubscribers)
    private usersSubscribersRepository: typeof UsersSubscribers,
    @InjectModel(UsersFolovers)
    private usersFoloversRepositories: typeof UsersFolovers,
    @InjectModel(SubscribeRequests)
    private subscribeRequests: typeof SubscribeRequests,
    private tokenHeandlerService: TokenHeandlerService,
    private subEventEmitter: EventEmitter2,
  ) {}

  async createUsers(createUserDto: CreateUsersDto) {
    return await this.usersRepository.create(createUserDto);
  }

  async getMyPage(accsesToken: string) {
    const reqUserId = this.tokenHeandlerService.getUserId(accsesToken);
    return await this.usersRepository.findOne({
      where: { userId: reqUserId },
      include: { all: true },
    });
  }

  async getUserPage(accsesToken: string, targetUserId: string) {
    try {
      const reqUserId = this.tokenHeandlerService.getUserId(accsesToken);
      const user = await this.usersRepository.findOne({
        where: { userId: reqUserId },
      });
      const targetUser = await this.usersRepository.findOne({
        where: { userId: targetUserId },
      });
      if (user && targetUser) {
        const isSubscribe = await this.usersRepository.findOne({
          where: {
            userId: reqUserId,
          },
          include: {
            model: UsersSubscribers,
            as: 'subscriber',
            where: {
              userId: targetUserId,
            },
          },
        });
        if (isSubscribe) {
          const openUserData = await this.usersRepository.findOne({
            where: { userId: targetUserId },
            include: { all: true },
          });
          return openUserData;
        }
        const closeUserData = await this.usersRepository.findOne({
          where: { userId: targetUserId },
        });
        return closeUserData;
      }
      throw new HttpException('User not found..', HttpStatus.BAD_REQUEST);
    } catch (error) {
      return error;
    }
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
        const isExistSubRequest = await this.subscribeRequests.findOne({
          where: {
            user: subUser.userId,
            subUserId: user.userId,
          },
        });
        const isSubscribed = await this.usersRepository.findOne({
          where: {
            userId: user.userId,
          },
          include: {
            model: UsersSubscribers,
            as: 'subscriber',
            where: {
              userId: subUser.userId,
            },
          },
        });
        if (isExistSubRequest || isSubscribed) {
          throw new HttpException(
            'Subscribe request already exist or user subscribed',
            HttpStatus.BAD_REQUEST,
          );
        }
        const subRequest = await this.subscribeRequests.create();
        await subRequest.update({
          user: subUser.userId,
          subUserId: user.userId,
        });
        await subUser.$add('subRequests', subRequest);
        this.subEventEmitter.emit('subscribeRequest', user, subUser);
        return {
          message: `Subscribe request successfully sended to ${subUser.firstName} ${subUser.lastName} newsletter`,
        };
      }
      throw new HttpException('User not found..', HttpStatus.BAD_REQUEST);
    } catch (error) {
      return error;
    }
  }

  async subscribeAccept(accsesToken: string, subRequestId: string) {
    try {
      const reqUserId = this.tokenHeandlerService.getUserId(accsesToken);
      const user = await this.usersRepository.findOne({
        where: { userId: reqUserId },
      });
      const subRequest = await this.subscribeRequests.findOne({
        where: {
          user: user.userId,
          requestId: subRequestId,
        },
      });
      if (!subRequest) {
        throw new HttpException(
          'Subscribe request not found',
          HttpStatus.BAD_REQUEST,
        );
      }
      const subUser = await this.usersRepository.findOne({
        where: { userId: subRequest.subUserId },
      });
      if (user && subUser) {
        const subscribeRecord = await this.usersSubscribersRepository.create();
        await subscribeRecord.$set('subscriber', subUser.userId);
        await subscribeRecord.update({ userId: user.userId });
        const foloverRecord = await this.usersFoloversRepositories.create();
        await foloverRecord.$set('folover', user.userId);
        await foloverRecord.update({ userId: subUser.userId });
        await subRequest.destroy();
        return {
          message: `Now ${subUser.firstName} ${subUser.lastName} foloving you`,
        };
      }
      throw new HttpException('User not found..', HttpStatus.BAD_REQUEST);
    } catch (error) {
      return error;
    }
  }

  async subscribeReject(accsesToken: string, subRequestId: string) {
    try {
      const reqUserId = this.tokenHeandlerService.getUserId(accsesToken);
      const user = await this.usersRepository.findOne({
        where: { userId: reqUserId },
      });
      if (user) {
        const subRequest = await this.subscribeRequests.findOne({
          where: {
            user: user.userId,
            requestId: subRequestId,
          },
        });
        if (subRequest) {
          await subRequest.destroy();
          return {
            message: `Subscribe request was rejected`,
          };
        }
        throw new HttpException(
          'Subscribe request not found',
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
        const subscribeRecord = await this.usersSubscribersRepository.findOne({
          where: {
            folover: user.userId,
            userId: subUser.userId,
          },
        });
        const foloverRecord = await this.usersSubscribersRepository.findOne({
          where: {
            subscriber: subUser.userId,
            userId: user.userId,
          },
        });
        if (subscribeRecord && foloverRecord) {
          await subscribeRecord.destroy();
          await foloverRecord.destroy();
          return {
            message: `You successfully unsubscribed from ${subUser.firstName} ${subUser.lastName} newsletter`,
          };
        }
        throw new HttpException(
          'You already unsubscribed from user',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'User not found in folovers|subscribers lists..',
        HttpStatus.BAD_REQUEST,
      );
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

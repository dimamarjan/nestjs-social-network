import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { TokenHeandlerService } from './common/services/token-heandker.service';
import { Posts } from './posts/models/posts.model';
import { UsersSubscribers } from './users/models/users-subscribers.model';
import { Users } from './users/models/users.model';

@Injectable()
export class AppService {
  constructor(
    private tokenHeandlerService: TokenHeandlerService,
    @InjectModel(Posts)
    private postsRepository: typeof Posts,
    @InjectModel(Users) private usersRepository: typeof Users,
  ) {}

  async showPostsLine(accsesToken: string) {
    try {
      const reqUserId = this.tokenHeandlerService.getUserId(accsesToken);
      const user = await this.usersRepository.findOne({
        where: { userId: reqUserId },
        include: { model: UsersSubscribers, as: 'subscriber' },
      });
      const subList = user.subscriber.map((subUser) => subUser.userId);
      const posts = await this.postsRepository.findAll({
        where: { postOwner: { [Op.or]: [subList] } },
        include: { all: true },
      });
      return posts;
    } catch (error) {
      return error;
    }
  }
}

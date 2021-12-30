import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { TokenHeandlerService } from './common/services/token-heandker.service';
import { Posts } from './posts/models/posts.model';
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
        include: { all: true },
      });
      if (user.subscriber.length === 0) {
        throw new HttpException(
          'No subscriptions found',
          HttpStatus.BAD_REQUEST,
        );
      }
      const subList = user.subscriber.map((item) => item.userId);
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

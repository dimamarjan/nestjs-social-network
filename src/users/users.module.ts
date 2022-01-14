import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Filters } from '../filters/model/filters.model';
import { PostsFilters } from '../posts/models/posts-filters.model';
import { PostsMarks } from '../posts/models/posts-marks.model';
import { Posts } from '../posts/models/posts.model';
import { Users } from './models/users.model';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { TokenHeandlerService } from '../common/services/token-heandker.service';
import { UsersSubscribers } from './models/users-subscribers.model';
import { UsersFolovers } from './models/users-folovers.model';
import { SubscribeRequests } from './models/users-subscribe-requests.model';

@Module({
  controllers: [UsersController],
  providers: [UsersService, TokenHeandlerService],
  exports: [UsersService],
  imports: [
    SequelizeModule.forFeature([
      Users,
      Posts,
      PostsMarks,
      Filters,
      PostsFilters,
      UsersSubscribers,
      UsersFolovers,
      SubscribeRequests,
    ]),
    forwardRef(() => AuthModule),
  ],
})
export class UsersModule {}

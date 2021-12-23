import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Filters } from '../filters/model/filters.model';
import { PostsFilters } from '../posts/models/posts-filters.model';
import { PostsMarks } from '../posts/models/posts-marks';
import { Posts } from '../posts/models/posts.model';
import { Users } from './models/users.model';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { TokenHeandlerService } from '../common/services/token-heandker.service';

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
    ]),
    forwardRef(() => AuthModule),
  ],
})
export class UsersModule {}

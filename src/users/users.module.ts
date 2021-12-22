import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Filters } from '../filters/model/filters.model';
import { PostsFilters } from '../posts/models/posts-filters.model';
import { PostsMarks } from '../posts/models/posts-marks';
import { Posts } from '../posts/models/posts.model';
import { Users } from './models/users.model';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  imports: [
    SequelizeModule.forFeature([
      Users,
      Posts,
      PostsMarks,
      Filters,
      PostsFilters,
    ]),
  ],
})
export class UsersModule {}

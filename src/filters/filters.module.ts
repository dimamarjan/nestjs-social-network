import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostsFilters } from '../posts/models/posts-filters.model';
import { PostsMarks } from '../posts/models/posts-marks.model';
import { Users } from '../users/models/users.model';
import { Posts } from '../posts/models/posts.model';
import { UsersModule } from '../users/users.module';
import { FiltersController } from './filters.controller';
import { FiltersService } from './filters.service';
import { Filters } from './model/filters.model';

@Module({
  controllers: [FiltersController],
  providers: [FiltersService],
  imports: [
    UsersModule,
    SequelizeModule.forFeature([
      Posts,
      Users,
      Filters,
      PostsFilters,
      PostsMarks,
    ]),
  ],
})
export class FiltersModule {}

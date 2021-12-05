import { Module } from '@nestjs/common';
import { Posts } from './models/posts.model';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Users } from '../users/models/users.model';
import { AuthModule } from '../auth/auth.module';
import { Filters } from '../filters/model/filters.model';
import { PostsFilters } from './models/posts-filters.model';
import { UsersModule } from 'src/users/users.module';
import { PostsMarks } from './models/posts-marks';
import { S3Module } from 'src/s3/s3.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [
    AuthModule,
    UsersModule,
    SequelizeModule.forFeature([
      Posts,
      Users,
      PostsMarks,
      Filters,
      PostsFilters,
    ]),
    S3Module,
  ],
})
export class PostsModule {}

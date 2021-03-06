import { Module } from '@nestjs/common';
import { Posts } from './models/posts.model';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Users } from '../users/models/users.model';
import { AuthModule } from '../auth/auth.module';
import { Filters } from '../filters/model/filters.model';
import { PostsFilters } from './models/posts-filters.model';
import { UsersModule } from '../users/users.module';
import { PostsMarks } from './models/posts-marks.model';
import { S3Module } from '../s3/s3.module';
import { Comments } from '../comments/model/commets.model';
import { CommentsModule } from '../comments/comments.module';
import { CommentsService } from '../comments/comments.service';
import { TokenHeandlerService } from '../common/services/token-heandker.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService, CommentsService, TokenHeandlerService],
  imports: [
    AuthModule,
    UsersModule,
    SequelizeModule.forFeature([
      Posts,
      Users,
      PostsMarks,
      Filters,
      PostsFilters,
      Comments,
    ]),
    S3Module,
    CommentsModule,
  ],
})
export class PostsModule {}

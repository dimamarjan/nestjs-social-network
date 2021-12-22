import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { TokenHeandlerService } from '../common/services/token-heandker.service';
import { Posts } from '../posts/models/posts.model';
import { CommentsService } from './comments.service';
import { Comments } from './model/commets.model';

@Module({
  providers: [CommentsService, TokenHeandlerService],
  imports: [AuthModule, SequelizeModule.forFeature([Posts, Comments])],
})
export class CommentsModule {}

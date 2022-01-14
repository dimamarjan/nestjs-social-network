import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import { Users } from './users/models/users.model';
import { Posts } from './posts/models/posts.model';
import { Filters } from './filters/model/filters.model';
import { PostsFilters } from './posts/models/posts-filters.model';
import { PostsMarks } from './posts/models/posts-marks.model';
import { FiltersModule } from './filters/filters.module';
import { S3Module } from './s3/s3.module';
import { CommentsModule } from './comments/comments.module';
import { Comments } from './comments/model/commets.model';
import { NotifyMailerModule } from './common/services/mailer/mailer.module';
import { UsersSubscribers } from './users/models/users-subscribers.model';
import { UsersFolovers } from './users/models/users-folovers.model';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenHeandlerService } from './common/services/token-heandker.service';
import { SubscribeRequests } from './users/models/users-subscribe-requests.model';
import { EventEmitterModule } from '@nestjs/event-emitter';

const dbOptions: SequelizeModuleOptions = {
  dialect: 'postgres',
  logging: false,
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  host: process.env.PGDATABASE_HOST,
  port: Number(process.env.PGDATABASE_PORT),
  username: process.env.PGDATABASE_USERNAME,
  password: process.env.PGDATABASE_PASSWORD,
  database: process.env.PGDATABASE_DATABASE,
  models: [
    Users,
    Posts,
    PostsMarks,
    Filters,
    PostsFilters,
    Comments,
    UsersSubscribers,
    UsersFolovers,
    SubscribeRequests,
  ],
  autoLoadModels: true,
};

@Module({
  imports: [
    SequelizeModule.forRoot(dbOptions),
    AuthModule,
    PostsModule,
    UsersModule,
    FiltersModule,
    S3Module,
    CommentsModule,
    NotifyMailerModule,
    SequelizeModule.forFeature([Posts, Users]),
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [TokenHeandlerService, AppService],
})
export class AppModule {}

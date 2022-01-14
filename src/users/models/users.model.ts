import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { PostsMarks } from '../../posts/models/posts-marks.model';
import { Posts } from '../../posts/models/posts.model';
import { IUsers } from '../interfaces/user.interface';
import { UsersFolovers } from './users-folovers.model';
import { SubscribeRequests } from './users-subscribe-requests.model';
import { UsersSubscribers } from './users-subscribers.model';

@Table({ tableName: 'users' })
export class Users extends Model<Users, IUsers> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    unique: true,
    primaryKey: true,
  })
  userId: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: true })
  password: string;

  @Column({ type: DataType.STRING, allowNull: true })
  firstName: string;

  @Column({ type: DataType.STRING, allowNull: true })
  lastName: string;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'home' })
  authType: string;

  @HasMany(() => Posts)
  postOwner: Posts[];

  @BelongsToMany(() => Posts, () => PostsMarks)
  user: Posts[];

  @HasMany(() => UsersSubscribers)
  subscriber: UsersSubscribers[];

  @HasMany(() => UsersFolovers)
  folover: UsersFolovers[];

  @HasMany(() => SubscribeRequests)
  subRequests: SubscribeRequests[];

  toJSON() {
    return {
      userId: this.userId,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      subscribtions: this.subscriber,
      folovers: this.folover,
      subRequests: this.subRequests,
      posts: this.postOwner,
    };
  }
}

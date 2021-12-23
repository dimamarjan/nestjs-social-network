import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { PostsMarks } from '../../posts/models/posts-marks';
import { Posts } from '../../posts/models/posts.model';
import { IUsers } from '../interfaces/user.interface';

@Table({ tableName: 'users' })
export class Users extends Model<Users, IUsers> {
  @Column({
    type: DataType.STRING,
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

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
  })
  subscribes: string[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
  })
  folovers: string[];

  @HasMany(() => Posts)
  postOwner: Posts[];

  @BelongsToMany(() => Posts, () => PostsMarks)
  user: Posts[];

  version: false;

  toJSON() {
    return {
      userId: this.userId,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
    };
  }
}

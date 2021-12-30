import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Users } from '../../users/models/users.model';
import { Posts } from './posts.model';

@Table({ tableName: 'posts_marks', timestamps: false })
export class PostsMarks extends Model<PostsMarks> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    unique: true,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Users)
  @Column({ type: DataType.STRING })
  user: string;

  @ForeignKey(() => Posts)
  @Column({ type: DataType.STRING })
  markedUsers: string;
}

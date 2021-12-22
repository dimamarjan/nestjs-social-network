import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Posts } from '../../posts/models/posts.model';
import { IComments } from '../interface/comments.interface';

@Table({ tableName: 'comments' })
export class Comments extends Model<Comments, IComments> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    unique: true,
    primaryKey: true,
  })
  commentId: string;

  @Column({ type: DataType.STRING })
  author: string;

  @ForeignKey(() => Posts)
  @Column({ type: DataType.UUID })
  post: string;

  @Column({ type: DataType.STRING, allowNull: false })
  commentText: string;

  @BelongsTo(() => Posts)
  posts: Posts[];

  toJSON() {
    return {
      commentId: this.commentId,
      author: this.author,
      commentText: this.commentText,
    };
  }
}

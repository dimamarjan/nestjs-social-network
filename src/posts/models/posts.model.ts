import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Users } from '../../users/models/users.model';
import { IPosts } from '../interfaces/posts.interface';
import { Filters } from '../../filters/model/filters.model';
import { PostsFilters } from './posts-filters.model';
import { PostsMarks } from './posts-marks';
import { Comments } from '../../comments/model/commets.model';

@Table({ tableName: 'posts' })
export class Posts extends Model<Posts, IPosts> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    unique: true,
    primaryKey: true,
  })
  postId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  description: string;

  @Column({ type: DataType.STRING, allowNull: true })
  imageSlug: string;

  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: true })
  mark: string[];

  @ForeignKey(() => Users)
  @Column({
    type: DataType.STRING,
  })
  postOwner: string;

  @BelongsTo(() => Users)
  user: Users[];

  @BelongsToMany(() => Users, () => PostsMarks)
  markedUsers: Users[];

  @BelongsToMany(() => Filters, () => PostsFilters)
  filter: Filters[];

  @HasMany(() => Comments)
  comment: Comments[];

  toJSON() {
    return {
      postId: this.postId,
      imageSlug: this.imageSlug,
      filter: this.filter,
      author: this.user,
      markedUsers: this.markedUsers,
      comments: this.comment,
    };
  }
}

import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Users } from '../../users/models/users.model';
import { IPosts } from '../interfaces/posts.interface';
import { Filters } from '../../filters/model/filters.model';
import { PostsFilters } from './posts-filters.model';
import { PostsMarks } from './posts-marks';

@Table
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

  @Column({ type: DataType.STRING, allowNull: true })
  mark: string;

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

  toJSON() {
    return {
      postId: this.postId,
      imageSlug: this.imageSlug,
      filter: this.filter,
      author: this.user,
      markedUsers: this.markedUsers,
    };
  }
}

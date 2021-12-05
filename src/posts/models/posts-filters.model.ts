import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Filters } from '../../filters/model/filters.model';
import { Posts } from './posts.model';

@Table({ tableName: 'posts_filters', timestamps: false })
export class PostsFilters extends Model<PostsFilters> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    unique: true,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Posts)
  @Column({ type: DataType.STRING })
  postId: string;

  @ForeignKey(() => Filters)
  @Column({ type: DataType.STRING })
  filterId: string;
}

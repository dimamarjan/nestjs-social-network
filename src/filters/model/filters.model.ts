import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { IFilters } from '../interface/filters.interface';
import { PostsFilters } from '../../posts/models/posts-filters.model';
import { Posts } from '../../posts/models/posts.model';

@Table({ tableName: 'filters' })
export class Filters extends Model<Filters, IFilters> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    unique: true,
    primaryKey: true,
  })
  filterId: string;

  @Column({ type: DataType.STRING, allowNull: true, unique: true })
  filterName: string;

  @BelongsToMany(() => Posts, () => PostsFilters)
  post: Posts[];

  toJSON() {
    return {
      filterName: this.filterName,
    };
  }
}

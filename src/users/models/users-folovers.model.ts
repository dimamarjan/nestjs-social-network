import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Users } from './users.model';

@Table({ tableName: 'users_folovers', timestamps: false })
export class UsersFolovers extends Model<UsersFolovers> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    unique: true,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Users)
  @Column({ type: DataType.UUID })
  subscriber: string;

  @Column({ type: DataType.UUID })
  userId: string;

  @BelongsTo(() => Users)
  folover: Users;

  toJSON() {
    return {
      userId: this.userId,
    };
  }
}

import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Users } from './users.model';

@Table({ tableName: 'users_subscribers', timestamps: false })
export class UsersSubscribers extends Model<UsersSubscribers> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    unique: true,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Users)
  @Column({ type: DataType.UUID })
  folover: string;

  @Column({ type: DataType.UUID })
  userId: string;

  @BelongsTo(() => Users)
  subscriber: Users;

  toJSON() {
    return {
      userId: this.userId,
    };
  }
}

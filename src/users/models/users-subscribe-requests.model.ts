import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Users } from './users.model';

@Table({ tableName: 'subscribe_requsts', timestamps: false })
export class SubscribeRequests extends Model<SubscribeRequests> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    unique: true,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Users)
  @Column({ type: DataType.UUID })
  user: string;

  @Column({ type: DataType.UUID })
  subUserId: string;

  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, unique: true })
  requestId: string;

  @BelongsTo(() => Users)
  subRequest: Users;

  toJSON() {
    return {
      requestId: this.requestId,
      subUserId: this.subUserId,
    };
  }
}

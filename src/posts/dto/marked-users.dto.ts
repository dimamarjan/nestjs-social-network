import { IsString } from 'class-validator';

export class MarkedUsersDto {
  @IsString()
  readonly usersId: string;
}

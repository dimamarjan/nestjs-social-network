import { IsEmail, IsString } from 'class-validator';

export class CreateUsersDto {
  @IsEmail({}, { message: 'incorrect email' })
  readonly email: string;

  readonly password?: string;

  @IsString()
  readonly firstName?: string;

  @IsString()
  readonly lastName?: string;

  authType?: string;
}

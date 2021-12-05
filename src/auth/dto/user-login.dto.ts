import { IsString, IsEmail } from 'class-validator';

export class LoginUsersDto {
  @IsEmail({}, { message: 'incorrect email' })
  readonly email: string;

  @IsString()
  readonly password: string;
}

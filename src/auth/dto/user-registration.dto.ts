import { IsString, IsEmail } from 'class-validator';

export class RegistrationUsersDto {
  @IsEmail({}, { message: 'incorrect email' })
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;
}

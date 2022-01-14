import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class LoginUsersDto {
  @ApiProperty({
    example: 'example@mail.com',
    description: 'user`s registration email',
  })
  @IsEmail({}, { message: 'incorrect email' })
  readonly email: string;

  @ApiProperty({
    example: 'someUserPassword123456',
    description: 'password can contain any numbers or letters',
  })
  @IsString()
  readonly password: string;
}

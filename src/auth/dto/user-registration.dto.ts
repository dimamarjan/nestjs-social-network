import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsAlphanumeric } from 'class-validator';

export class RegistrationUsersDto {
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
  @IsAlphanumeric()
  readonly password: string;

  @ApiProperty({
    example: 'Lorem',
    description: 'users`s first name',
  })
  @IsString()
  readonly firstName: string;

  @ApiProperty({
    example: 'Ipsum',
    description: 'users`s last name',
  })
  @IsString()
  readonly lastName: string;
}

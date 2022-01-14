import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

export class UsersResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV4YW1wbGVAbWFpbC5jb20iLCJwYXNzd29yZCI6InNvbWVVc2VyUGFzc3dvcmQxMjM0NTYifQ.ZijSR3jHiYQmNHKvn4KmrT_DyYK_xiwnCqvdzKgjdqY',
    description: 'user`s generated token',
  })
  token: string;

  @ApiProperty({
    example: uuidv4(),
    description: 'user`s generated ID type of UUIDv4',
  })
  userId: string;

  @ApiProperty({
    example: 'example@mail.com',
    description: 'user`s registration email',
  })
  email: string;

  @ApiProperty({
    example: 'Lorem',
    description: 'users`s first name',
  })
  firstName: string;
}

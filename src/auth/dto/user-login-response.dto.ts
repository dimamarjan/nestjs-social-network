import { ApiProperty } from '@nestjs/swagger';

export class UsersLoginResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV4YW1wbGVAbWFpbC5jb20iLCJwYXNzd29yZCI6InNvbWVVc2VyUGFzc3dvcmQxMjM0NTYifQ.ZijSR3jHiYQmNHKvn4KmrT_DyYK_xiwnCqvdzKgjdqY',
    description: 'user`s generated token',
  })
  token: string;
}

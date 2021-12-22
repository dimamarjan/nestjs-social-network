import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenHeandlerService {
  constructor(private jwtService: JwtService) {}

  getUserId(accsesToken: string) {
    const key = accsesToken.split(' ')[1];
    const user = this.jwtService.verify(key);
    return user.userId;
  }
}

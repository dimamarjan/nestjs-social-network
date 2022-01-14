import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { OnEvent } from '@nestjs/event-emitter';
import { UserDto } from '../../../users/dto/user.dto';
import { PostDto } from '../../../posts/dto/post.dto';

@Injectable()
export class NotifyMailerService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmailAdd(user: UserDto, post: PostDto) {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        from: process.env.MAIL_USER,
        subject: `New post with you! Come and see!`,
        text: `${post.postOwner} tagged you on the post ${post.title}`,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async sendSubRequest(subUser: UserDto, folover: UserDto) {
    try {
      await this.mailerService.sendMail({
        to: subUser.email,
        from: process.env.MAIL_USER,
        subject: 'Someone wants to following you!',
        text: `
        Hi ${subUser.firstName}!
        ${folover.firstName} ${folover.lastName} wants to following you.
        `,
      });
    } catch (err) {
      console.log(err);
    }
  }

  @OnEvent('markUser')
  public sendNotify(user: UserDto, post: PostDto) {
    this.sendEmailAdd(user, post);
  }

  @OnEvent('subscribeRequest')
  public sendUserReq(subUser: UserDto, folover: UserDto) {
    this.sendSubRequest(subUser, folover);
  }
}

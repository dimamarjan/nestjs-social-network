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

  @OnEvent('markUser')
  public async sendNotify(user: UserDto, post: PostDto) {
    this.sendEmailAdd(user, post);
  }
}

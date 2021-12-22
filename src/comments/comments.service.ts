import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Posts } from 'src/posts/models/posts.model';
import { DeleteCommentsDto } from './dto/comment-delete.dto';
import { CreateNewCommentsDto } from './dto/comments-create.dto';
import { UpdateCommentsDto } from './dto/comments-update.dto';
import { Comments } from './model/commets.model';
import { TokenHeandlerService } from '../common/services/token-heandker.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Posts) private postsRepository: typeof Posts,
    @InjectModel(Comments) private commentsRepository: typeof Comments,
    private tokenHeandlerService: TokenHeandlerService,
  ) {}

  async addPostComment(
    accsesToken: string,
    postId: string,
    createNewCommentsDto: CreateNewCommentsDto,
  ) {
    try {
      const reqUserId = this.tokenHeandlerService.getUserId(accsesToken);
      const post = await this.postsRepository.findOne({
        where: {
          postId,
        },
      });
      if (!post) {
        throw new HttpException('post not found', HttpStatus.BAD_REQUEST);
      }
      if (post.postOwner === reqUserId || post.mark.includes(reqUserId)) {
        createNewCommentsDto.author = reqUserId;
        const comment = await this.commentsRepository.create(
          createNewCommentsDto,
        );
        await post.$add('comment', comment);
        return comment;
      }
      throw new HttpException(
        'comenting this post not permitted',
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      return error;
    }
  }

  async updatePostComment(
    accsesToken: string,
    postId: string,
    updateCommentsDto: UpdateCommentsDto,
  ) {
    try {
      const reqUserId = this.tokenHeandlerService.getUserId(accsesToken);
      const post = await this.postsRepository.findOne({
        where: {
          postId,
        },
        include: [
          {
            model: Comments,
            as: 'comment',
            where: {
              commentId: updateCommentsDto.commentId,
              author: reqUserId,
            },
          },
        ],
      });
      if (!post) {
        throw new HttpException('comment not found', HttpStatus.BAD_REQUEST);
      }
      await this.commentsRepository.update(
        { commentText: updateCommentsDto.commentText },
        { where: { commentId: updateCommentsDto.commentId } },
      );
      return { message: 'comment was updated' };
    } catch (error) {
      return error;
    }
  }

  async deletePostComment(
    accsesToken: string,
    postId: string,
    deleteCommentsDto: DeleteCommentsDto,
  ) {
    try {
      const reqUserId = this.tokenHeandlerService.getUserId(accsesToken);
      const post = await this.postsRepository.findOne({
        where: {
          postId,
        },
        include: [
          {
            model: Comments,
            as: 'comment',
            where: {
              commentId: deleteCommentsDto.commentId,
            },
          },
        ],
      });
      if (!post) {
        throw new HttpException('comment not found', HttpStatus.BAD_REQUEST);
      }
      if (
        post.postOwner === reqUserId ||
        post.comment[0].author === reqUserId
      ) {
        await this.commentsRepository.destroy({
          where: {
            commentId: deleteCommentsDto.commentId,
          },
        });
        return { message: 'comment was deleted' };
      }
      throw new HttpException(
        'deleting this comment not permitted',
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      return error;
    }
  }
}

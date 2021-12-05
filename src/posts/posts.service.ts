import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { UsersService } from '../users/users.service';
import { Users } from '../users/models/users.model';
import { CreatePostsDto } from './dto/post-create.dto';
import { Posts } from './models/posts.model';
import { Filters } from '../filters/model/filters.model';
import { S3Service } from '../s3/s3.service';
import { UpdatePostsDto } from './dto/post-update.dto';
import { UserIdDto } from './dto/post-user-id.dto';
import { PostFilterDto } from './dto/post-filter.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Posts) private postsRepository: typeof Posts,
    @InjectModel(Filters) private filtersRepository: typeof Filters,
    private s3Service: S3Service,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async create(
    accsesToken: string,
    createPostsDto: CreatePostsDto,
    file: { bufer: Buffer },
  ) {
    try {
      const reqUserId = await this.getUserId(accsesToken);
      const user = await this.usersService.findUserById({ userId: reqUserId });
      if (user) {
        const postedImage = await this.s3Service.s3upload(file);
        if (!postedImage) {
          throw new HttpException('wrong data type', HttpStatus.BAD_REQUEST);
        }
        createPostsDto.imageSlug = postedImage.Location;
        if (createPostsDto.filterName) {
          const filter = await this.filtersRepository.findOne({
            where: { filterName: createPostsDto.filterName },
          });
          if (!filter) {
            throw new HttpException(
              'no such filter found',
              HttpStatus.BAD_REQUEST,
            );
          }
          const post = await this.postsRepository.create(createPostsDto);
          await post.$set('filter', filter);
          await post.$set('user', user);
          return post;
        }
        const post = await this.postsRepository.create(createPostsDto);
        await post.$set('user', user);
        return post;
      }
      throw new HttpException(
        'not permitted or user not found',
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      return error;
    }
  }

  async remove(accsesToken: string, postId: string) {
    try {
      const reqUserId: string = await this.getUserId(accsesToken);
      const post = await this.postsRepository.destroy({
        where: {
          postId,
          postOwner: reqUserId,
        },
      });
      if (post) {
        return { message: 'post was deleted.. ' };
      }
      throw new HttpException(
        'not permitted or post not found',
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      return error;
    }
  }

  async update(
    accsesToken: string,
    postId: string,
    updatePostsDto: UpdatePostsDto,
  ) {
    try {
      const reqUserId: string = await this.getUserId(accsesToken);
      const post = await this.postsRepository.update(updatePostsDto, {
        where: {
          postId,
          postOwner: reqUserId,
        },
      });
      if (post) {
        return { message: 'post was updated' };
      }
      throw new HttpException(
        'not permitted or post not found',
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      return error;
    }
  }

  async getPosts(accsesToken: string) {
    try {
      const reqUserId: string = await this.getUserId(accsesToken);
      const getUsersPosts = await this.postsRepository.findAll({
        where: { postOwner: reqUserId },
        include: [
          { model: Users, as: 'user' },
          { model: Users, as: 'markedUsers' },
          { model: Filters, as: 'filter' },
        ],
      });
      if (!getUsersPosts) {
        return { message: 'any posts yet :)' };
      }
      return getUsersPosts;
    } catch (error) {
      return error;
    }
  }

  async markUsers(accsesToken: string, postId: string, userId: UserIdDto) {
    try {
      const reqUserId = this.getUserId(accsesToken);
      const user = await this.usersService.findUserById(userId);
      const post = await this.postsRepository.findOne({
        where: {
          postId,
          postOwner: reqUserId,
        },
      });
      if (post) {
        await post.$add('markedUsers', user);
        return { message: 'user added to post' };
      }
      throw new HttpException(
        'not permitted or post not found',
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      return error;
    }
  }

  async unMarkUsers(accsesToken: string, postId: string, userId: UserIdDto) {
    try {
      const reqUserId: string = this.getUserId(accsesToken);
      const user = await this.usersService.findUserById(userId);
      const post = await this.postsRepository.findOne({
        where: {
          postId,
          postOwner: reqUserId,
        },
      });
      if (post) {
        await post.$remove('markedUsers', user);
        return { message: 'user removed from post' };
      }
      throw new HttpException(
        'not permitted or post not found',
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      return error;
    }
  }

  async getMarkMePosts(accsesToken: string) {
    try {
      const reqUserId: string = await this.getUserId(accsesToken);
      const posts = await this.postsRepository.findAll({
        include: [
          {
            model: Users,
            as: 'markedUsers',
            where: {
              userId: reqUserId,
            },
          },
        ],
      });
      if (!posts) {
        return { message: 'no marked posts' };
      }
      return posts;
    } catch (err) {
      return err;
    }
  }

  async addPostFilter(
    accsesToken: string,
    postId: string,
    postFilterDto: PostFilterDto,
  ) {
    try {
      const reqUserId: string = await this.getUserId(accsesToken);
      const filter = await this.filtersRepository.findOne({
        where: postFilterDto,
      });
      if (!filter) {
        throw new HttpException('filter not found', HttpStatus.BAD_REQUEST);
      }
      const post = await this.postsRepository.findOne({
        where: {
          postId,
          postOwner: reqUserId,
        },
      });
      if (post) {
        post.$add('filter', filter);
        return { message: 'filter successfuly added' };
      }
      throw new HttpException(
        'not permitted or post not found',
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      return error;
    }
  }

  async removePostFilter(
    accsesToken: string,
    postId: string,
    postFilterDto: PostFilterDto,
  ) {
    try {
      const reqUserId: string = await this.getUserId(accsesToken);
      const filter = await this.filtersRepository.findOne({
        where: postFilterDto,
      });
      if (!filter) {
        throw new HttpException('filter not found', HttpStatus.BAD_REQUEST);
      }
      const post = await this.postsRepository.findOne({
        where: {
          postId,
          postOwner: reqUserId,
        },
      });
      if (post) {
        post.$remove('filter', filter);
        return { message: 'filter successfuly removed' };
      }
      throw new HttpException(
        'not permitted or post not found',
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      return error;
    }
  }

  getUserId(accsesToken: string) {
    const key = accsesToken.split(' ')[1];
    const user = this.jwtService.verify(key);
    return user.userId;
  }
}

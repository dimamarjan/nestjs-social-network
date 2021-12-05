import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/auth-jwt.guard';
import { CreatePostsDto } from './dto/post-create.dto';
import { PostsService } from './posts.service';
import { UpdatePostsDto } from './dto/post-update.dto';
import { UserIdDto } from './dto/post-user-id.dto';
import { PostFilterDto } from './dto/post-filter.dto';
import { ValidationPipe } from '../pipes/validation.pipe';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ValidationPipe)
  addPost(
    @Headers('authorization') accsesToken: string,
    @Body() createPostsDto: CreatePostsDto,
    @UploadedFile() file: any,
  ) {
    return this.postsService.create(accsesToken, createPostsDto, file);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  removePost(
    @Headers('authorization') accsesToken: string,
    @Param('id') postId: string,
  ) {
    return this.postsService.remove(accsesToken, postId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getUsersPosts(@Headers('authorization') accsesToken: string) {
    return this.postsService.getPosts(accsesToken);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  @UsePipes(ValidationPipe)
  updatePost(
    @Headers('authorization') accsesToken: string,
    @Param('id') postId: string,
    @Body() updatePostsDto: UpdatePostsDto,
  ) {
    return this.postsService.update(accsesToken, postId, updatePostsDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/addmark')
  markPosts(
    @Param('id') postId: string,
    @Headers('authorization') accsesToken: string,
    @Body() userIdDto: UserIdDto,
  ) {
    return this.postsService.markUsers(accsesToken, postId, userIdDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id/unmark')
  unMarkPosts(
    @Param('id') postId: string,
    @Headers('authorization') accsesToken: string,
    @Body() userIdDto: UserIdDto,
  ) {
    return this.postsService.unMarkUsers(accsesToken, postId, userIdDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/marked')
  myMarkedPosts(@Headers('authorization') accsesToken: string) {
    return this.postsService.getMarkMePosts(accsesToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/addfilter')
  addPostFilters(
    @Param('id') postId: string,
    @Headers('authorization') accsesToken: string,
    @Body() postFilterDto: PostFilterDto,
  ) {
    return this.postsService.addPostFilter(accsesToken, postId, postFilterDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id/removefilter')
  removePostFilters(
    @Param('id') postId: string,
    @Headers('authorization') accsesToken: string,
    @Body() postFilterDto: PostFilterDto,
  ) {
    return this.postsService.removePostFilter(
      accsesToken,
      postId,
      postFilterDto,
    );
  }
}

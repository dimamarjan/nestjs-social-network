import { IsString } from 'class-validator';

export class CreatePostsDto {
  @IsString()
  readonly title: string;
  @IsString()
  readonly description: string;

  imageSlug?: string;

  filterName?: string;
}

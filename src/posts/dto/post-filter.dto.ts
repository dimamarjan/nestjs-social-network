import { IsString } from 'class-validator';

export class PostFilterDto {
  @IsString()
  readonly filterName: string;
}

import { IsString } from 'class-validator';

export class ParamsPostDto {
  @IsString()
  readonly filters?: string;
}

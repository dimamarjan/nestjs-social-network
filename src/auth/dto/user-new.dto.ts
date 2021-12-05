export class NewUsersDto {
  readonly userId: string;
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  authType?: string;
}

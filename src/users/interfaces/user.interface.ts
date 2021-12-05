export interface IUsers {
  readonly usersId?: string;
  readonly email: string;
  readonly password?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly localRegistration?: boolean;
  readonly authType?: string;
  posts?: string[];
}

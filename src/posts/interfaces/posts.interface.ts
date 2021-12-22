export interface IPosts {
  readonly postId?: string;
  readonly title: string;
  readonly description: string;
  readonly mark?: string[];
  readonly imageSlug?: string;
  readonly filters?: string;
  readonly markedUsers?: string[];
  postOwner?: string;
  readonly filterName?: string;
}

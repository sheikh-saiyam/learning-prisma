import { Post } from "../../../generated/prisma/client";
import { PostStatus } from "../../../generated/prisma/enums";

export interface GetPostsParams {
  skip: number;
  take: number;
  orderBy: { [key: string]: "asc" | "desc" } | undefined;
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
  authorId: string | undefined;
}

export type CreatePostType = Omit<
  Post,
  "id" | "createdAt" | "updatedAt" | "authorId"
> & {
  title: string;
};

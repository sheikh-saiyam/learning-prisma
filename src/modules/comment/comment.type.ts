import { CommentStatus } from "../../../generated/prisma/enums";

export interface CreateCommentType {
  content: string;
  postId: string;
  authorId: string;
  parentId?: string;
}

export interface GetALlCommentsParams {
  postId?: string | undefined;
  authorId?: string | undefined;
  status?: CommentStatus;
  skip: number;
  take: number;
  orderBy?: { [key: string]: "asc" | "desc" } | undefined;
  search?: string | undefined;
}

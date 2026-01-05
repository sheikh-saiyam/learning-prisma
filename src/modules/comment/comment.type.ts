export interface CreateCommentType {
  content: string;
  postId: string;
  authorId: string;
  parentId?: string;
}

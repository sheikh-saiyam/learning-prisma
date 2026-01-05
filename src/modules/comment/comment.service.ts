import { prisma } from "../../lib/prisma";
import { CreateCommentType } from "./comment.type";

const createComment = async (payload: CreateCommentType) => {
  const post = await prisma.post.findUnique({
    where: {
      id: payload.postId,
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  if (payload.parentId) {
    const parent = await prisma.comment.findUnique({
      where: {
        id: payload.parentId,
      },
    });

    if (!parent) {
      throw new Error("Parent comment not found");
    }

    if (parent.postId !== payload.postId) {
      throw new Error("Parent comment does not belong to this post");
    }
  }

  const result = await prisma.comment.create({
    data: payload,
    include: { parent: true },
  });

  return result;
};

export const commentServices = {
  createComment,
};

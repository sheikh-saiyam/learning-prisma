import { UserRole } from "../../../generated/prisma/enums";
import { CommentUpdateInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { CreateCommentType } from "./comment.type";

const createComment = async (payload: CreateCommentType) => {
  const post = await prisma.post.findUnique({
    where: {
      id: payload.postId,
    },
  });

  if (!post) {
    throw new Error("Post not found!");
  }

  if (payload.parentId) {
    const parent = await prisma.comment.findUnique({
      where: {
        id: payload.parentId,
      },
    });

    if (!parent) {
      throw new Error("Parent comment not found!");
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

const getCommentById = async (id: string) => {
  const result = await prisma.comment.findUnique({
    where: { id },
    include: {
      parent: { select: { id: true, content: true, authorId: true } },
      replies: { select: { id: true, content: true, authorId: true } },
      post: { select: { id: true, title: true } },
      author: { select: { id: true, name: true, email: true } },
    },
  });

  return result;
};

const getCommentsByAuthorId = async (authorId: string) => {
  const result = await prisma.comment.findMany({
    where: { authorId },
    include: {
      parent: { select: { id: true, content: true, authorId: true } },
      replies: { select: { id: true, content: true, authorId: true } },
      post: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

const deleteComment = async (id: string, authorId: string, role: UserRole) => {
  const comment = await prisma.comment.findUnique({
    where: { id },
    select: { id: true, authorId: true },
  });

  if (!comment) throw new Error("Comment not found!");

  if (comment.authorId !== authorId && role !== UserRole.ADMIN) {
    throw new Error("You are not authorized to delete this comment!");
  }

  const result = await prisma.comment.delete({ where: { id: comment.id } });
  return result;
};

const updateComment = async (
  id: string,
  authorId: string,
  role: UserRole,
  payload: CommentUpdateInput
) => {
  if (!payload || Object.keys(payload).length === 0) {
    throw new Error("No update data provided!");
  }

  const comment = await prisma.comment.findUnique({
    where: { id },
    select: { id: true, authorId: true },
  });

  if (!comment) throw new Error("Comment not found!");

  if (comment.authorId !== authorId && role !== UserRole.ADMIN) {
    throw new Error("You are not authorized to delete this comment!");
  }

  const result = await prisma.comment.update({
    where: { id },
    data: payload,
  });

  return result;
};

export const commentServices = {
  createComment,
  getCommentById,
  getCommentsByAuthorId,
  deleteComment,
  updateComment,
};

import { CommentCreateInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createComment = async (payload: CommentCreateInput) => {
  const result = await prisma.comment.create({
    data: payload,
    include: { parent: true },
  });
  return result;
};

export const commentServices = {
  createComment,
};

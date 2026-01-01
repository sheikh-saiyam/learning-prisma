import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId"> & {
    title: string;
  },
  userId: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};

const createManyPosts = async (
  data: Array<
    Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId"> & {
      title: string;
    }
  >,
  userId: string
) => {
  const result = await prisma.post.createMany({
    data: data.map((post) => ({
      ...post,
      authorId: userId,
    })),
  });
  return result;
};

const getPosts = async (search?: string) => {
  const result = await prisma.post.findMany({
    include: { author: { select: { name: true, email: true } } },
    where: {
      OR: [
        {
          title: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search as string,
            mode: "insensitive",
          },
        },
      ],
    },
  });
  return result;
};

export const postServices = { createPost, createManyPosts, getPosts };

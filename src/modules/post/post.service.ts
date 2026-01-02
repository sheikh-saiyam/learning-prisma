import { Post, PostStatus } from "../../../generated/prisma/client";
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

const getPosts = async ({
  search,
  tags,
  isFeatured,
  status,
  authorId,
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
  authorId: string | undefined;
}) => {
  const result = await prisma.post.findMany({
    include: { author: { select: { name: true, email: true } } },
    where: {
      AND: [
        // searching in title, content and tags
        {
          ...(search && {
            OR: [
              {
                title: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                content: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                tags: {
                  has: search,
                },
              },
            ],
          }),
        },
        // filtering by tags
        {
          ...(tags.length > 0 && {
            tags: {
              hasEvery: tags,
            },
          }),
        },
        // filtering by isFeatured
        {
          ...(typeof isFeatured === "boolean" && {
            isFeatured: isFeatured,
          }),
        },
        // filtering by status
        {
          ...(status && {
            status: status,
          }),
        },
        // filtering by authorId
        {
          ...(authorId && {
            authorId: authorId,
          }),
        },
      ],
    },
  });
  return result;
};

export const postServices = { createPost, createManyPosts, getPosts };

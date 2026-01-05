import { prisma } from "../../lib/prisma";
import { CreatePostType, GetPostsParams } from "./post.types";

const createPost = async (data: CreatePostType, userId: string) => {
  const result = await prisma.post.create({
    data: { ...data, authorId: userId },
  });
  return result;
};

const createManyPosts = async (data: Array<CreatePostType>, userId: string) => {
  const result = await prisma.post.createMany({
    data: data.map((post) => ({ ...post, authorId: userId })),
  });
  return result;
};

const getPosts = async ({
  skip,
  take,
  orderBy,
  search,
  tags,
  isFeatured,
  status,
  authorId,
}: GetPostsParams) => {
  const result = await prisma.post.findMany({
    include: {
      author: { select: { id: true, name: true, email: true } },
      // counts of comments
      _count: { select: { comments: true } },
    },
    // filtering
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
    // pagination
    skip: skip,
    take: take,
    // sorting
    ...(orderBy && { orderBy }),
  });

  const total = await prisma.post.count();

  return { data: result, total };
};

const getPostById = async (postId: string) => {
  const result = await prisma.$transaction(async (ctx) => {
    const post = await ctx.post.findUnique({
      where: { id: postId },
      include: {
        _count: {
          select: { comments: true },
        },
        // 1st level of comments - Parent comments
        comments: {
          orderBy: { createdAt: "desc" },
          where: {
            parentId: null,
            status: "APPROVED",
          },
          // 2nd level of comments - Replies to Parent comments
          include: {
            _count: {
              select: { replies: true },
            },
            replies: {
              orderBy: {
                createdAt: "asc",
              },
              where: {
                status: "APPROVED",
              },
              // 3rd level of comments - Replies to Replies
              include: {
                _count: {
                  select: { replies: true },
                },
                replies: {
                  orderBy: {
                    createdAt: "asc",
                  },
                  where: {
                    status: "APPROVED",
                  },
                },
                author: { select: { id: true, name: true, email: true } },
              },
            },
            author: { select: { id: true, name: true, email: true } },
          },
        },
        author: { select: { id: true, name: true, email: true } },
      },
    });

    await ctx.post.update({
      where: { id: postId },
      data: { views: { increment: 1 } },
    });

    return post;
  });

  return result;
};

export const postServices = {
  createPost,
  createManyPosts,
  getPosts,
  getPostById,
};

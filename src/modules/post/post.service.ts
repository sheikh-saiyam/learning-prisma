import { UserRole } from "../../../generated/prisma/enums";
import { PostUpdateInput } from "../../../generated/prisma/models";
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

    if (!post) throw new Error("Post not found");

    await ctx.post.update({
      where: { id: postId },
      data: { views: { increment: 1 } },
    });

    return post;
  });

  return result;
};

const getMyPosts = async ({
  skip,
  take,
  orderBy,
  search,
  tags,
  isFeatured,
  status,
  authorId,
}: GetPostsParams & { authorId: string }) => {
  const user = await prisma.user.findUnique({
    where: { id: authorId },
    select: { status: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user?.status !== "ACTIVE") {
    throw new Error("User is not active");
  }

  const result = await prisma.post.findMany({
    // filtering
    where: {
      authorId,
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
      ],
    },
    // pagination
    skip: skip,
    take: take,
    // sorting
    ...(orderBy && { orderBy }),
    include: { _count: { select: { comments: true } } },
  });

  const total = await prisma.post.count();

  return { data: result, total };
};

const updatePost = async (
  id: string,
  payload: PostUpdateInput,
  authorId: string,
  isAdmin: boolean
) => {
  if (!payload || Object.keys(payload).length === 0) {
    throw new Error("No update data provided!");
  }

  const post = await prisma.post.findUnique({
    where: { id },
    select: { id: true, authorId: true },
  });

  if (!post) throw new Error("Post not found!");

  if (!isAdmin && payload.isFeatured !== undefined) {
    delete payload.isFeatured;
  }

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not authorized to update this post!");
  }

  const result = await prisma.post.update({
    where: { id },
    data: payload,
  });

  return result;
};

const deletePost = async (id: string, authorId: string, isAdmin: boolean) => {
  const post = await prisma.post.findUnique({
    where: { id },
    select: { id: true, authorId: true },
  });

  if (!post) throw new Error("Post not found!");

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not authorized to update this post!");
  }

  const result = await prisma.post.delete({
    where: { id },
  });

  return result;
};

export const postServices = {
  createPost,
  createManyPosts,
  getPosts,
  getPostById,
  getMyPosts,
  updatePost,
  deletePost,
};

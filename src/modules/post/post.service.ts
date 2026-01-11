import {
  PostUpdateInput,
  PostWhereInput,
} from "../../../generated/prisma/models";
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
  const whereFilters: PostWhereInput = {
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
  };

  const result = await prisma.post.findMany({
    include: {
      author: { select: { id: true, name: true, email: true } },
      // counts of comments
      _count: { select: { comments: true } },
    },
    // filtering
    where: whereFilters,
    // pagination
    skip: skip,
    take: take,
    // sorting
    ...(orderBy && { orderBy }),
  });

  const total = await prisma.post.count({
    where: whereFilters,
  });

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

  const whereFilters: PostWhereInput = {
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
  };

  const result = await prisma.post.findMany({
    // filtering
    where: whereFilters,
    // pagination
    skip: skip,
    take: take,
    // sorting
    ...(orderBy && { orderBy }),
    include: { _count: { select: { comments: true } } },
  });

  const total = await prisma.post.count({
    where: whereFilters,
  });

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

const getPostStats = async () => {
  const result = await prisma.$transaction(async (tx) => {
    const [
      total,
      totalPublished,
      totalDraft,
      totalArchived,
      totalFeatured,
      totalAuthorsAdmin,
      totalAuthorsUser,
      viewsAgg,
      totalComments,
      totalApprovedComments,
      totalRejectedComments,
    ] = await Promise.all([
      // total aggregations
      tx.post.count(),

      tx.post.count({
        where: { status: "PUBLISHED" },
      }),

      tx.post.count({
        where: { status: "DRAFT" },
      }),

      tx.post.count({
        where: { status: "ARCHIVED" },
      }),

      tx.post.count({
        where: { isFeatured: true },
      }),

      tx.post.groupBy({
        by: ["authorId"],
        where: {
          author: {
            role: "ADMIN",
          },
        },
      }),

      tx.post.groupBy({
        by: ["authorId"],
        where: {
          author: {
            role: "USER",
          },
        },
      }),

      // views aggregation
      tx.post.aggregate({
        _sum: { views: true },
        _avg: { views: true },
        _min: { views: true },
        _max: { views: true },
      }),

      // comment aggregations
      tx.comment.count(),
      tx.comment.count({
        where: { status: "APPROVED" },
      }),
      tx.comment.count({
        where: { status: "REJECTED" },
      }),
    ]);

    const {
      _sum: { views: totalViews },
      _avg: { views: avgViews },
      _min: { views: minViews },
      _max: { views: maxViews },
    } = viewsAgg;

    return {
      totalAgg: {
        total,
        totalPublished,
        totalDraft,
        totalArchived,
        totalFeatured,
        totalAuthorsAdmin: totalAuthorsAdmin.length,
        totalAuthorsUser: totalAuthorsUser.length,
      },
      viewsAgg: {
        total: totalViews ?? 0,
        avg: parseFloat(avgViews?.toFixed(2) ?? "0"),
        min: minViews ?? 0,
        max: maxViews ?? 0,
      },
      commentAgg: {
        total: totalComments,
        totalApproved: totalApprovedComments,
        totalRejected: totalRejectedComments,
      },
    };
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
  getPostStats,
};

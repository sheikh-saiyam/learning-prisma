import { Request, Response } from "express";
import { postServices } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import { buildPaginationAndSort } from "../../utils/pagination-sort";

const createPost = async (req: Request, res: Response) => {
  try {
    const result = await postServices.createPost(req.body, req?.user?.id!);
    res.status(201).send({
      success: true,
      message: "Post created successfully!",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const createManyPosts = async (req: Request, res: Response) => {
  try {
    const result = await postServices.createManyPosts(req.body, req?.user?.id!);
    res.status(201).send({
      success: true,
      message: "Posts created successfully!",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const getPosts = async (req: Request, res: Response) => {
  try {
    const { search, tags, isFeatured, status, authorId } = req.query;

    const { skip, take, orderBy } = buildPaginationAndSort(req.query);

    const splittedTags = tags ? (tags as string).split(",") : [];
    const booleanIsFeatured =
      isFeatured === "true" ? true : isFeatured === "false" ? false : undefined;

    const result = await postServices.getPosts({
      skip,
      take,
      orderBy,
      search: search as string,
      tags: splittedTags,
      isFeatured: booleanIsFeatured,
      status: status as PostStatus | undefined,
      authorId: authorId as string | undefined,
    });

    res.status(201).send({
      success: true,
      message: "Post retrieve successfully!",
      meta: {
        total: result.total,
        page: Math.ceil(skip / take) + 1,
        totalPages: Math.ceil(result.total / take),
        limit: take,
        skip: skip,
      },
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await postServices.getPostById(id!);

    if (!result) {
      return res.status(404).send({
        success: false,
        message: "Post not found!",
      });
    }

    res.status(200).send({
      success: true,
      message: "Post retrieved successfully!",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const postControllers = {
  createPost,
  createManyPosts,
  getPosts,
  getPostById,
};

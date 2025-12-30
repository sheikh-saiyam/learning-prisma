import { Request, Response } from "express";
import { postServices } from "./post.service";

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

const getPosts = async (req: Request, res: Response) => {
  try {
    const result = await postServices.getPosts();
    res.status(201).send({
      success: true,
      message: "Post retrieve successfully!",
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
  getPosts,
};

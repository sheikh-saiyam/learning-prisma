import { Request, Response } from "express";
import { commentServices } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
  try {
    const result = await commentServices.createComment({
      ...req.body,
      authorId: req.user?.id,
    });

    res.status(201).json({
      success: true,
      message: "Comment created successfully!",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const commentControllers = {
  createComment,
};

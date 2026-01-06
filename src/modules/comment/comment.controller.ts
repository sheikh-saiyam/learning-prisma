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

const getCommentById = async (req: Request, res: Response) => {
  try {
    const result = await commentServices.getCommentById(req.params.id!);

    res.status(200).json({
      success: true,
      message: "Comment retrieved successfully!",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const getCommentsByAuthorId = async (req: Request, res: Response) => {
  try {
    const result = await commentServices.getCommentsByAuthorId(req.params.id!);

    res.status(200).json({
      success: true,
      message: "Comments retrieved successfully!",
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
  getCommentById,
  getCommentsByAuthorId,
};

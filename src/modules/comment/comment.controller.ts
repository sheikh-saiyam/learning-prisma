import { NextFunction, Request, Response } from "express";
import { commentServices } from "./comment.service";
import { CommentStatus } from "../../../generated/prisma/enums";

const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    next(error);
  }
};

const getCommentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await commentServices.getCommentById(req.params.id!);

    res.status(200).json({
      success: true,
      message: "Comment retrieved successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getCommentsByAuthorId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await commentServices.getCommentsByAuthorId(req.params.id!);

    res.status(200).json({
      success: true,
      message: "Comments retrieved successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req?.user?.id;
    const userRole = req?.user?.role;

    const result = await commentServices.deleteComment(id!, userId!, userRole!);

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req?.user?.id;
    const userRole = req?.user?.role;
    const payload = req.body;

    const result = await commentServices.updateComment(
      id!,
      userId!,
      userRole!,
      payload
    );

    res.status(200).json({
      success: true,
      message: "Comment updated successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const changeCommentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status }: { status: CommentStatus } = req.body;

    const result = await commentServices.changeCommentStatus(id!, status);

    res.status(200).json({
      success: true,
      message: "Comment status updated successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const commentControllers = {
  createComment,
  getCommentById,
  getCommentsByAuthorId,
  deleteComment,
  updateComment,
  changeCommentStatus,
};

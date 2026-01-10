import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let errorMessage = "Internal Server Error";
  let errorDetails = null;

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "Validation Error";
    errorDetails = err.message;
  }

  console.error(err.stack);
  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    error: errorDetails,
  });
};

export default errorHandler;

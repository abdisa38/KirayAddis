import { Request, Response, NextFunction } from "express";

export interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  errors?: Record<string, any>;
  keyValue?: Record<string, any>;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging in development
  console.error(`[Error] ${err.name}: ${err.message}`);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    error.message = "Resource not found with the specified ID.";
    error.statusCode = 404;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : "field";
    error.message = `A record with this ${field} already exists.`;
    error.statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === "ValidationError" && err.errors) {
    const messages = Object.values(err.errors).map((val: any) => val.message);
    error.message = messages.join(". ");
    error.statusCode = 400;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

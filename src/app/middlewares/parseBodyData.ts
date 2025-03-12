import { NextFunction, Request, Response } from "express";

export const parseBodyData = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.body.bodyData) {
    try {
      req.body = JSON.parse(req.body.bodyData);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Invalid JSON format in bodyData",
      });
      return; // Don't call next() after responding
    }
  }
  next();
};

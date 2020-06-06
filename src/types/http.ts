import { Request, Response, NextFunction } from "express";

export type HTTPMethod =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "connect"
  | "options"
  | "trace"
  | "patch";

export type HTTPRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) =>
  | {
      status: number;
      success: boolean;
      data?: object;
    }
  | never;

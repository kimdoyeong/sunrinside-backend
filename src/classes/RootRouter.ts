import express, { Router, Request, Response, NextFunction } from "express";
import RouterClass from "../classes/Router";
import { InternalServerError } from "../constants/errors/InternalServer";
import { ActionNotFound } from "../constants/errors/NotFound";
class RootRouter {
  private static router = Router();

  public static register(routerClass: typeof RouterClass) {
    const router = new routerClass();
    this.router.use(router.getRouter());
  }
  public static getRouter() {
    const router = this.router;
    router.use(express.json());
    router.use((req, res, next) => {
      next(ActionNotFound);
    });
    router.use(this.errorHandler);
    return router;
  }

  private static errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const error = err.code && err.status ? err : InternalServerError;
    if (!error.code && !err.status) {
      console.error(err);
    }

    res.status(err.status).json({
      success: false,
      message: err.message,
      status: err.status,
      code: err.code,
    });
  }
}

export default RootRouter;

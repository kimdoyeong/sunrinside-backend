import { Router, Request, Response, NextFunction } from "express";
import RouterClass from "../classes/Router";
import { InternalServerError } from "../constants/errors/InternalServer";
class RootRouter {
  private static router = Router();

  public static register(routerClass: typeof RouterClass) {
    const router = new routerClass();
    this.router.use(router.getRouter());
  }
  public static getRouter() {
    this.router.use(this.errorHandler);
    return this.router;
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

import { Router, Request, Response, NextFunction } from "express";
import RouterClass from "../classes/Router";
import { ActionNotFound } from "../constants/errors/NotFound";
import handleError from "../lib/handleError";
class RootRouter {
  private static router = Router();

  public static register(routerClass: typeof RouterClass) {
    const router = new routerClass();
    this.router.use(router.path, router.getRouter());
  }
  public static getRouter() {
    const router = this.router;
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
    const error = handleError(err);
    if (error.status === 500) {
      console.error(err);
    }

    res.status(error.status).json({
      success: false,
      message: error.message,
      status: error.status,
      code: error.code,
    });
  }
}

export default RootRouter;

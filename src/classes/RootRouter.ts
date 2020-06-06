import { Router } from "express";
import RouterClass from "../classes/Router";
class RootRouter {
  private static router = Router();

  public static register(routerClass: typeof RouterClass) {
    const router = new routerClass();
    this.router.use(router.getRouter());
  }
  public static getRouter() {
    return this.router;
  }
}

export default RootRouter;

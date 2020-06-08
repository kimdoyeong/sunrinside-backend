import Router from "../../classes/Router";
import { Request } from "express";
import ThreadManager from "../../classes/ThreadManager";

class ThreadListRouter extends Router {
  constructor() {
    super();
    this.register("get", "/", this.getList, { auth: true });
  }
  async getList(req: Request) {
    const type = req.query.type;

    if (type === "trending") {
      const page =
        (req.query.page &&
          typeof req.query.page === "string" &&
          parseInt(req.query.page, 10)) ||
        undefined;

      const limit =
        (req.query.limit &&
          typeof req.query.limit === "string" &&
          parseInt(req.query.limit, 10)) ||
        undefined;
      return {
        success: true,
        status: 200,
        data: await ThreadManager.getTrending(page, limit),
      };
    }
    return {
      success: false,
    };
  }
}

export default ThreadListRouter;

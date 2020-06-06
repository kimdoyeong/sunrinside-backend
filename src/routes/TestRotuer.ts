import Router from "../classes/Router";
import RootRouter from "../classes/RootRouter";

class TestRouter extends Router {
  constructor() {
    super();
    this.register("get", "/", this.getTime);
  }

  getTime() {
    return {
      success: true,
      status: 200,
      data: {
        time: Date.now(),
      },
    };
  }
}

RootRouter.register(TestRouter);

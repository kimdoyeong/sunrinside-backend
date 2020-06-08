import Router, { RequestWithLogin } from "../classes/Router";
import Thread, { IThread, getThreadWithSubthreads } from "../models/Thread";
import { ThreadNotFound } from "../constants/errors/NotFound";
import RootRouter from "../classes/RootRouter";

class ThreadRouter extends Router {
  constructor() {
    super("/thread");

    this.register("post", "/", this.createThread(false), {
      auth: true,
      validateForm: {
        type: "body",
        form: {
          title: {
            required: true,
            type: "string",
          },
          content: {
            required: true,
            type: "string",
          },
        },
      },
    });
    this.register("post", "/:id", this.createThread(true), {
      auth: true,
      validateForm: {
        type: "body",
        form: {
          content: {
            required: true,
            type: "string",
          },
        },
      },
    });
    this.register("get", "/:id", this.getThread, { auth: true });
  }

  createThread(isSubThread: boolean = false) {
    return async (req: RequestWithLogin) => {
      const { title, content } = req.body;
      const thread = new Thread({
        title: !isSubThread ? title : undefined,
        content,
        by: req.user._id,
      } as IThread);
      await thread.save();

      if (isSubThread) {
        const rootThreadId = req.params.id;

        thread.isSubthread = true;
        const rootThread = await Thread.findById(rootThreadId);
        if (!rootThread) throw ThreadNotFound;

        const threads = [...rootThread?.subthreads, thread._id];
        rootThread.subthreads = threads;
        await thread.save();
        await rootThread.save();

        return {
          status: 201,
          success: true,
        };
      }
      return {
        status: 201,
        success: true,
        data: {
          id: thread._id,
        },
      };
    };
  }

  async getThread(req: RequestWithLogin) {
    const _id = req.params.id;

    const thread = await getThreadWithSubthreads(_id);

    return {
      status: 200,
      success: true,
      data: thread,
    };
  }
}

RootRouter.register(ThreadRouter);

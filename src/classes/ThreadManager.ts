import Thread from "../models/Thread";
import { ThreadNotFound } from "../constants/errors/NotFound";
import env from "../constants/env";

class ThreadManager {
  public static async getWithSubthreads(_id: string) {
    const userNo: any = {};
    let i = 1;

    async function getSubthreads(subthreads: string[]) {
      if (subthreads.length === 0) return [];

      const threads = await Promise.all(
        subthreads.map(async (_id) => {
          const subthread = await Thread.findById(_id);
          if (!subthread) return null;
          if (!userNo[subthread.by.toString()]) {
            userNo[subthread.by.toString()] = {
              userId: i++,
            };
          }

          const data: any = subthread.toObject();
          data.subthreads = await getSubthreads(subthread.subthreads);
          data.by = userNo[subthread.by.toString()];
          return data;
        })
      );
      return threads.filter(Boolean);
    }
    const thread = await Thread.findOne({ _id, isSubthread: false });
    if (!thread) throw ThreadNotFound;

    const data = thread.toObject();
    data.subthreads = await getSubthreads(thread.subthreads);
    userNo[thread.by.toString()] = {
      userId: i++,
      isWriter: true,
    };
    data.by = userNo[thread.by.toString()];

    return data;
  }
  public static async getTrending(page: number = 1, limit: number = 20) {
    const threads = await Thread.find({ isSubthread: false }, [
      "title",
      "subthreads",
      "vote",
      "point",
    ])
      .gt("createdAt", Date.now() - env.HOT_THREAD_PERIOD)
      .sort("statics.point")
      .limit(limit)
      .skip((page - 1) * limit);

    const data = threads
      .map((v) => v.toObject())
      .map((v) => {
        return {
          ...v,
          subthreads: v.subthreads.length,
        };
      });
    return data;
  }
}
export default ThreadManager;

import { Schema, model, Document } from "mongoose";
import User from "./User";
import { ThreadNotFound } from "../constants/errors/NotFound";

const modelName = "thread";
const threadSchema = new Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  by: {
    type: Schema.Types.ObjectId,
    ref: User.modelName,
    required: true,
  },
  isSubthread: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  subthreads: [
    {
      type: Schema.Types.ObjectId,
      ref: modelName,
    },
  ],
  medias: {
    type: [String],
    default: [],
  },
  vote: {
    type: {
      up: Number,
      down: Number,
    },
    default: {
      up: 0,
      down: 0,
    },
  },
  statics: {
    type: {
      point: Number,
    },
    default: {
      point: 0,
    },
  },
});

export interface IThread {
  title?: string;
  content: string;
  by: string;
  subthreads?: string[];
  medias?: string[];
  isSubthread?: boolean;
}
export interface ThreadDocument extends IThread, Document {
  subthreads: string[];
  medias: string[];
  isSubthread: boolean;
  vote: {
    up: number;
    down: number;
  };
  statics: {
    point: number;
  };
}

threadSchema.pre("save", async function (this: ThreadDocument, next) {
  const subthreads = await Promise.all(
    this.subthreads.map((subthread) =>
      Thread.findById(subthread, ["statics.point"])
    )
  );
  const subthreadAllPoint = subthreads
    .map((v) => v?.statics.point || 0)
    .reduce((a, b) => a + b, 0);

  const point =
    this.vote.up - this.vote.down + this.subthreads.length + subthreadAllPoint;
  this.statics = {
    ...this.statics,
    point,
  };
});
const Thread = model<ThreadDocument>(modelName, threadSchema);

export async function getThreadWithSubthreads(_id: string) {
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
export default Thread;

import { Schema, model, Document } from "mongoose";
import User from "./User";

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
  console.log(this.subthreads, subthreadAllPoint, point);
  this.statics = {
    ...this.statics,
    point,
  };
});
const Thread = model<ThreadDocument>(modelName, threadSchema);

export default Thread;

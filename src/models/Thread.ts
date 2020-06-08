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
}
export interface ThreadDocument extends IThread, Document {
  subthreads: string[];
  medias: string[];
  vote: {
    up: number;
    down: number;
  };
  statics: {
    point: number;
  };
}

const Thread = model<ThreadDocument>(modelName, threadSchema);

export default Thread;

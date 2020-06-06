import { connect } from "mongoose";
import env from "../constants/env";

function connectDB() {
  return connect(env.MONGO_URI);
}

export default connectDB;

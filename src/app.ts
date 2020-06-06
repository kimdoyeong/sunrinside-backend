import express from "express";
import cors from "cors";
import "./routes";
import RootRouter from "./classes/RootRouter";
import env from "./constants/env";

const app = express();

app.use(
  cors({
    origin: env.NODE_ENV === "production" ? "https://sunrinexit.wtf" : "*",
  })
);
app.use(RootRouter.getRouter());

export default app;

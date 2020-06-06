import express from "express";
import "./routes";
import RootRouter from "./classes/RootRouter";

const app = express();

app.use(RootRouter.getRouter());

export default app;

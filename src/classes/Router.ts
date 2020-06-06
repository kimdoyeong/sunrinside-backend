import { Router as ExpressRouter, RequestHandler } from "express";
import { HTTPMethod, HTTPRequestHandler } from "../types/http";

class Router {
  private router = ExpressRouter();

  getRouter() {
    return this.router;
  }
  register(
    method: HTTPMethod,
    path: string,
    handler: HTTPRequestHandler,
    ...middlewares: RequestHandler[]
  ) {
    const wrapHandler: RequestHandler = (req, res, next) => {
      Promise.resolve(handler(req, res, next))
        .then((value) => {
          if (value) {
            res.status(value.status).json(value);
          }
        })
        .catch((e) => {
          next(e);
        });
    };
    this.router[method](path, ...(middlewares || []), wrapHandler);
  }
}

export default Router;

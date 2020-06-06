import { Router as ExpressRouter, RequestHandler } from "express";
import { HTTPMethod, HTTPRequestHandler } from "../types/http";

class Router {
  private router = ExpressRouter();

  constructor() {
    this.register.bind(this);
  }

  getRouter() {
    return this.router;
  }
  register(
    method: HTTPMethod,
    path: string,
    handler: any,
    ...middlewares: RequestHandler[]
  ) {
    const wrapHandler: RequestHandler = (req, res, next) => {
      Promise.resolve(handler(req, res, next))
        .then((value) => {
          if (value) {
            res.status(value.status || 200).json(value);
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

import express, { Router as ExpressRouter, RequestHandler } from "express";
import { HTTPMethod } from "../types/http";
import validateForm, { ValidateFormType } from "../lib/validateForm";
import { FormBadRequestError } from "../constants/errors/BadRequest";

class Router {
  private router = ExpressRouter();

  constructor() {
    this.router.use(express.json());
    this.register.bind(this);
  }

  getRouter() {
    return this.router;
  }
  registerSubrouter(path: string, subrouter: typeof Router) {
    const router = new subrouter();
    this.router.use(path, router.getRouter());
  }
  use(...handlers: RequestHandler[]) {
    this.router.use(...handlers);
  }
  register(
    method: HTTPMethod,
    path: string,
    handler: any,
    options?: {
      middlewares?: RequestHandler[];
      validateForm?: {
        type: "query" | "body" | "params";
        form: ValidateFormType;
      };
    }
  ) {
    const wrapHandler: RequestHandler = (req, res, next) => {
      if (options?.validateForm) {
        const data = req[options.validateForm.type];
        const { isValid, notValidKeys } = validateForm(
          data,
          options.validateForm.form
        );

        if (!isValid) {
          return next(FormBadRequestError(notValidKeys.join(", ")));
        }
      }
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
    this.router[method](path, ...(options?.middlewares || []), wrapHandler);
  }
}

export default Router;

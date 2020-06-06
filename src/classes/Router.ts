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
  register(
    method: HTTPMethod,
    path: string,
    handler: any,
    options?: {
      middlewares?: RequestHandler[];
      validForm?: {
        type: "query" | "body" | "params";
        form: ValidateFormType;
      };
    }
  ) {
    const wrapHandler: RequestHandler = (req, res, next) => {
      if (options?.validForm) {
        const data = req[options.validForm.type];
        const { isValid, notValidKeys } = validateForm(
          data,
          options.validForm.form
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

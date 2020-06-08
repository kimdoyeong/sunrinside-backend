import express, {
  Router as ExpressRouter,
  RequestHandler,
  Request,
} from "express";
import { HTTPMethod } from "../types/http";
import validateForm, { ValidateFormType } from "../lib/validateForm";
import { FormBadRequestError } from "../constants/errors/BadRequest";
import { verifyToken } from "../lib/token";
import { TokenForbiddenError } from "../constants/errors/Auth";
import { UserDocument } from "../models/User";

interface PathOptions {
  middlewares?: RequestHandler[];
  validateForm?: {
    type: "query" | "body" | "params";
    form: ValidateFormType;
  };
  auth?: "admin" | "user" | boolean;
}
export interface RequestWithLogin extends Request {
  user: UserDocument;
}
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
    options?: PathOptions
  ) {
    const wrapHandler: RequestHandler = (req, res, next) => {
      this.handleRegisterOptions(req as any, options)
        .then(() => {
          return Promise.resolve(handler(req, res, next));
        })
        .then((value: any) => {
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
  private async handleRegisterOptions(
    req: RequestWithLogin,
    options?: PathOptions
  ) {
    if (!options) return;

    if (options.validateForm) {
      const data = req[options.validateForm.type];
      const { isValid, notValidKeys } = validateForm(
        data,
        options.validateForm.form
      );

      if (!isValid) {
        throw FormBadRequestError(notValidKeys.join(", "));
      }
    }

    if (options.auth) {
      const authorization = req.headers["authorization"];
      if (!authorization || typeof authorization !== "string")
        throw TokenForbiddenError;
      const data = await verifyToken(authorization);

      if (options.auth === "admin" && !data.user.isAdmin)
        throw TokenForbiddenError;
      req.user = data.user;
    }
  }
}
export default Router;

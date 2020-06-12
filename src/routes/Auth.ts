import Router from "../classes/Router";
import { Request } from "express";
import RootRouter from "../classes/RootRouter";
import User from "../models/User";
import { AuthForbiddenError } from "../constants/errors/Auth";
import { createToken } from "../lib/token";
import ValidatorBuilder from "../lib/validatorBuilder";

class AuthRouter extends Router {
  constructor() {
    super();

    this.register("post", "/auth", this.createToken, {
      validateForm: {
        type: "body",
        form: ValidatorBuilder.create()
          .add("username", "string", true)
          .add("password", "string", true),
      },
    });
  }

  async createToken(req: Request) {
    const { username, password } = req.body;
    const user = await User.findOne({
      username,
    });
    if (!user || !user.validatePassword(password)) {
      throw AuthForbiddenError;
    }
    const token = await createToken(user);

    return {
      status: 201,
      success: true,
      data: {
        token,
      },
    };
  }
}

RootRouter.register(AuthRouter);

import Router from "../classes/Router";
import { Request } from "express";
import RootRouter from "../classes/RootRouter";
import User, { IUser } from "../models/User";

class UserRouter extends Router {
  constructor() {
    super();

    this.register("post", "/user", this.createUser, {
      validForm: {
        type: "body",
        form: {
          username: {
            required: true,
            type: "string",
          },
          password: {
            required: true,
            type: "string",
          },
          name: {
            required: true,
            type: "string",
          },
        },
      },
    });
  }

  async createUser(req: Request) {
    const { username, password, name } = req.body;
    const user = new User({
      name,
      username,
      password,
    } as IUser);

    await user.save();

    return {
      status: 200,
      success: true,
    };
  }
}

RootRouter.register(UserRouter);

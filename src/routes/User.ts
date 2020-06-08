import Router, { RequestWithLogin } from "../classes/Router";
import { Request } from "express";
import RootRouter from "../classes/RootRouter";
import User, { IUser } from "../models/User";

class UserRouter extends Router {
  constructor() {
    super();

    this.register("get", "/user", this.getUser, { auth: true });
    this.register("post", "/user", this.createUser, {
      validateForm: {
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
          email: {
            required: true,
            type: "string",
          },
        },
      },
    });
    this.register("get", "/user/exists", this.isExistsUser, {
      validateForm: {
        type: "query",
        form: {
          username: {
            required: true,
            type: "string",
          },
        },
      },
    });
  }

  async createUser(req: Request) {
    const { username, password, name, email } = req.body;
    const user = new User({
      name,
      username,
      password,
      email,
    } as IUser);

    await user.save();

    return {
      status: 200,
      success: true,
    };
  }
  async isExistsUser(req: Request) {
    const { username } = req.query;
    const user = await User.findOne({ username: username as any });
    return {
      status: 200,
      success: true,
      data: {
        exists: !!user,
      },
    };
  }
  async getUser(req: RequestWithLogin) {
    const {
      user: { name, isAdmin, email, username },
    } = req;
    return {
      status: 200,
      success: true,
      data: {
        name,
        isAdmin,
        email,
        username,
      },
    };
  }
}

RootRouter.register(UserRouter);

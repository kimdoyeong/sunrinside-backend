import { Request } from "express";
import Router from "../../classes/Router";
import User from "../../models/User";
import { UserNotFound } from "../../constants/errors/NotFound";

class UserAdminRouter extends Router {
  constructor() {
    super();
    this.register("put", "/:id/admin", this.setUserAdmin, { auth: "admin" });
  }

  async setUserAdmin(req: Request) {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) throw UserNotFound;
    user.isAdmin = true;
    await user.save();

    return {
      status: 200,
      success: true,
    };
  }
}

export default UserAdminRouter;

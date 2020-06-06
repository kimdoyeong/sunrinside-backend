import { Schema, model, Document } from "mongoose";
import { randomBytes, pbkdf2Sync } from "crypto";

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    set(this: any, v: string) {
      const key = randomBytes(64).toString("base64");
      const password = pbkdf2Sync(v, key, 100000, 64, "sha512").toString(
        "base64"
      );
      this.key = key;
      return password;
    },
  },
  key: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
});
export interface IUser {
  username: string;
  password: string;
  key?: string;
  name: string;
}
export interface UserDocument extends IUser, Document {
  key: string;
  validatePassword(password: string): boolean;
}

UserSchema.methods.validatePassword = function (
  this: UserDocument,
  password: string
) {
  const encryptedPassword = pbkdf2Sync(
    password,
    this.key,
    100000,
    64,
    "sha512"
  ).toString("base64");
  return this.password === encryptedPassword;
};
const User = model<UserDocument>("user", UserSchema);

export default User;

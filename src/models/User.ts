import { Schema, model, Document } from "mongoose";
import { randomBytes, pbkdf2Sync } from "crypto";
import { EmailForbiddenError } from "../constants/errors/Auth";
import EmailManager from "../classes/EmailManager";
import randomChars from "../lib/randomChars";

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
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  emailValidate: {
    type: {
      validated: Boolean,
      code: String,
    },
    default: {
      validated: false,
    },
  },
});
export interface IUser {
  username: string;
  password: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}
export interface UserDocument extends IUser, Document {
  key: string;
  emailValidate: {
    validated: boolean;
    code: string | undefined;
  };
  isAdmin: boolean;
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
UserSchema.pre("validate", function (this: UserDocument, next) {
  if (!this.email.match(/\@sunrint\.hs\.kr$/)) throw EmailForbiddenError;
  next();
});
UserSchema.pre("save", async function (this: UserDocument) {
  if (!this.emailValidate.code && !this.emailValidate.validated) {
    const code = randomChars(24);
    this.emailValidate.code = code;

    console.log(this._id, code);
    await EmailManager.sendVerifyEmail(this.email, this._id, code);
  }
});

const User = model<UserDocument>("user", UserSchema);
export default User;

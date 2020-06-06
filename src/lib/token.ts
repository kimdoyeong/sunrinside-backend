import { sign, decode, verify } from "jsonwebtoken";
import User, { UserDocument } from "../models/User";
import { TokenForbiddenError } from "../constants/errors/Auth";

interface TokenData {
  username: string;
  userId: string;
}
export async function createToken(user: UserDocument) {
  return await sign(
    {
      username: user.username,
      userId: user._id,
    },
    user.key,
    {
      expiresIn: "1d",
      issuer: "sunrinexit.wtf",
    }
  );
}

export async function decodeToken(token: string): Promise<TokenData> {
  return (await decode(token)) as any;
}
export async function verifyToken(token: string): Promise<TokenData> {
  const data = await decodeToken(token);
  const user = await User.findById(data.userId);
  if (!user) throw TokenForbiddenError;

  try {
    const data: any = await verify(token, user.key);
    return data;
  } catch (e) {
    console.error(e);
    throw TokenForbiddenError;
  }
}

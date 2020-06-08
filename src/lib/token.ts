import { sign, decode, verify } from "jsonwebtoken";
import User, { UserDocument } from "../models/User";
import { TokenForbiddenError } from "../constants/errors/Auth";

interface TokenData {
  username: string;
  userId: string;
  isAdmin?: boolean;
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
export async function verifyToken(
  token: string
): Promise<{
  token: TokenData;
  user: UserDocument;
}> {
  const data = await decodeToken(token);
  const user = await User.findById(data.userId);
  if (!user) throw TokenForbiddenError;

  try {
    const tokenData: any = await verify(token, user.key);
    return {
      token: tokenData,
      user,
    };
  } catch (e) {
    console.error(e);
    throw TokenForbiddenError;
  }
}

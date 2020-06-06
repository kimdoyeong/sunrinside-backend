import createError from "../../lib/createError";

export const TokenForbiddenError = createError(
  403,
  "TOKEN_FORBIDDEN",
  "토큰 인증에 실패했습니다."
);

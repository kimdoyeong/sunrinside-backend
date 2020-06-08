import createError from "../../lib/createError";

export const TokenForbiddenError = createError(
  403,
  "TOKEN_FORBIDDEN",
  "토큰 인증에 실패했습니다."
);

export const AuthForbiddenError = createError(
  403,
  "AUTH_FORBIDDEN",
  "로그인에 실패했습니다."
);

export const EmailForbiddenError = createError(
  401,
  "EMAIL_FORBIDDEN",
  "@sunrint.hs.kr 이메일을 사용해야 가입할 수 있습니다."
);

import createError from "../../lib/createError";

export const InternalServerError = createError(
  500,
  "INTERNAL_SERVER",
  "서버에서 오류가 발생했습니다."
);

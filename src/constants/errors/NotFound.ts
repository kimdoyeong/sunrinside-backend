import createError from "../../lib/createError";

export const ActionNotFound = createError(
  404,
  "ACTION_NOT_FOUND",
  "액션을 찾을 수 없습니다."
);

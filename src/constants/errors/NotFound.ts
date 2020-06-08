import createError from "../../lib/createError";

export const ActionNotFound = createError(
  404,
  "ACTION_NOT_FOUND",
  "액션을 찾을 수 없습니다."
);

export const UserNotFound = createError(
  404,
  "USER_NOT_FOUND",
  "유저를 찾을 수 없습니다."
);

export const ThreadNotFound = createError(
  404,
  "THREAD_NOT_FOUND",
  "쓰레드를 찾을 수 없습니다."
);

import createError from "../../lib/createError";

export const UniqueError = (key: string) =>
  createError(409, "UNIQUE_ERROR", `이미 존재하는 ${key}입니다.`);

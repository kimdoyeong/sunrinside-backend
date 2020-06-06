import createError from "../../lib/createError";

export const FormBadRequestError = (fields: string) =>
  createError(400, "FORM_BAD_REQUEST", `${fields} 필드가 잘못된 요청입니다.`);

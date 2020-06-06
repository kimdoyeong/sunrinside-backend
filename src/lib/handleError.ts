import { InternalServerError } from "../constants/errors/InternalServer";

function handleError(e: any) {
  if (e.code && e.status) return e;

  return InternalServerError;
}

export default handleError;

import { InternalServerError } from "../constants/errors/InternalServer";
import { UniqueError } from "../constants/errors/DB";

function handleError(e: any) {
  if (e.code && e.status) return e;
  if (e.name === "MongoError") {
    if (e.code === 11000 && e.keyValue) {
      return UniqueError(Object.keys(e.keyValue).join(","));
    }
  }
  return InternalServerError;
}

export default handleError;

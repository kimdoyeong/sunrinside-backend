function createError(status: number, code: string, message: string) {
  const error: any = new Error(message);
  error.status = status;
  error.code = code;
  return error;
}

export default createError;

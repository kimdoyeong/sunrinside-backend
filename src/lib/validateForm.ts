export interface ValidateFormType {
  [key: string]:
    | {
        type?: TypeofTypes;
        required?: boolean;
        validate?(v: any): boolean;
      }
    | TypeofTypes;
}

export type TypeofTypes =
  | "bigint"
  | "boolean"
  | "function"
  | "number"
  | "object"
  | "string"
  | "symbol"
  | "undefined";

function validateForm(data: any = {}, forms: ValidateFormType) {
  let isValidAll = true;
  const notValidKeys: string[] = [];

  function foundNotValid(key: string) {
    notValidKeys.push(key);
    isValidAll = false;
  }
  for (const [key, value] of Object.entries(data)) {
    if (!forms[key]) continue;
    const form = forms[key];
    if (typeof form === "string") {
      value && typeof value !== form && foundNotValid(key);
      continue;
    }

    if (
      (form.required && !value) ||
      (form.type && form.type !== typeof value) ||
      (form.validate && !form.validate(value))
    ) {
      foundNotValid(key);
      continue;
    }
  }

  return {
    isValid: isValidAll,
    notValidKeys,
  };
}

export default validateForm;

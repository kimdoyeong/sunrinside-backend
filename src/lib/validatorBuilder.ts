import { ValidateFormType, TypeofTypes, ValidateFormKey } from "./validateForm";

class ValidatorBuilder {
  private form: ValidateFormType = {};

  public static create() {
    return new ValidatorBuilder();
  }
  getObject() {
    return this.form;
  }
  add(key: string, type: ValidateFormKey | TypeofTypes, required?: boolean) {
    this.form[key] = type;

    if (required !== undefined) {
      if (typeof this.form[key] == "string")
        this.form[key] = { type: this.form[key] as any };
      (this.form[key] as ValidateFormKey).required = true;
    }

    return this;
  }
}

export default ValidatorBuilder;

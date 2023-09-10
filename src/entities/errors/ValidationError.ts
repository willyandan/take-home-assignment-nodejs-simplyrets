import { ValidationError as ClassValidatorError } from 'class-validator';
import { IHttpError } from './IHttpError';

export class ValidationError extends Error implements IHttpError {
  code = 400;
  errors: Array<String> = [];
  constructor(
    public message: string,
    validationErrors?: Array<ClassValidatorError>,
  ) {
    super(message);
    this.errors = validationErrors
      ? validationErrors
          .map((validationError) =>
            Object.values(validationError.constraints || {}),
          )
          .reduce(
            (errors, validationError) => [...errors, ...validationError],
            [],
          )
      : [];
  }
  toJson(): { code: number; message: string; errors: Array<String> } {
    return {
      code: this.code,
      message: `Error ${this.code}: ${this.message}`,
      errors: this.errors,
    };
  }
}

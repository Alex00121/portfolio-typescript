export interface ValidationResult<T = unknown> {
  valid: boolean;
  errors: { field: string; messages: string[] }[];
  data: T | null;
}

export interface ValidatorContext {
  field: string;
  path: string[];
}

export interface IValidator {
  validate(value: unknown, ctx?: ValidatorContext): ValidationResult;
}

export type TransformFn<T, R> = (value: T) => R;
export type CustomValidatorFn<T> = (value: T) => boolean | string;
export type RefineFn<T> = (value: T) => boolean;

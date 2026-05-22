import { ValidationResult, ValidatorContext, TransformFn, CustomValidatorFn, RefineFn } from './types';

export abstract class BaseValidator<T, TOut = T> {
  protected _optional = false;
  protected _nullable = false;
  protected _defaultValue: T | undefined = undefined;
  protected _hasDefault = false;
  protected _transforms: TransformFn<unknown, unknown>[] = [];
  protected _customValidators: { fn: CustomValidatorFn<T>; message: string }[] = [];
  protected _refines: { fn: RefineFn<T>; message: string }[] = [];

  optional(): this {
    this._optional = true;
    return this;
  }

  nullable(): this {
    this._nullable = true;
    return this;
  }

  default(value: T): this {
    this._defaultValue = value;
    this._hasDefault = true;
    return this;
  }

  transform<R>(fn: TransformFn<TOut, R>): BaseValidator<T, R> {
    const clone = this._clone() as BaseValidator<T, R>;
    (clone as unknown as BaseValidator<T, unknown>)._transforms.push(fn as TransformFn<unknown, unknown>);
    return clone;
  }

  custom(fn: CustomValidatorFn<T>, message = 'Custom validation failed'): this {
    this._customValidators.push({ fn, message });
    return this;
  }

  refine(fn: RefineFn<T>, message = 'Refinement failed'): this {
    this._refines.push({ fn, message });
    return this;
  }

  validate(value: unknown, ctx: ValidatorContext = { field: 'root', path: [] }): ValidationResult {
    const errors: { field: string; messages: string[] }[] = [];

    if (value === undefined || value === null) {
      if (this._nullable && value === null) {
        return { valid: true, errors: [], data: null };
      }
      if (this._hasDefault) {
        value = this._defaultValue;
      } else if (this._optional) {
        return { valid: true, errors: [], data: undefined as unknown };
      } else {
        return {
          valid: false,
          errors: [{ field: ctx.field, messages: [`${ctx.field} is required`] }],
          data: null,
        };
      }
    }

    const typeErrors = this._validateType(value, ctx);
    if (typeErrors.length > 0) {
      return { valid: false, errors: [{ field: ctx.field, messages: typeErrors }], data: null };
    }

    const ruleErrors = this._validateRules(value as T, ctx);

    for (const { fn, message } of this._customValidators) {
      const result = fn(value as T);
      if (result === false) ruleErrors.push(message);
      else if (typeof result === 'string') ruleErrors.push(result);
    }

    for (const { fn, message } of this._refines) {
      if (!fn(value as T)) ruleErrors.push(message);
    }

    if (ruleErrors.length > 0) {
      errors.push({ field: ctx.field, messages: ruleErrors });
      return { valid: false, errors, data: null };
    }

    let outputValue: unknown = value;
    for (const transform of this._transforms) {
      outputValue = transform(outputValue);
    }

    return { valid: true, errors: [], data: outputValue };
  }

  protected abstract _validateType(value: unknown, ctx: ValidatorContext): string[];
  protected abstract _validateRules(value: T, ctx: ValidatorContext): string[];
  protected abstract _clone(): BaseValidator<T, unknown>;
}

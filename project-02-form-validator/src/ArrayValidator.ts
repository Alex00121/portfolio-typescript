import { BaseValidator } from './BaseValidator';
import { ValidatorContext, ValidationResult, IValidator } from './types';

export class ArrayValidator<T> extends BaseValidator<T[]> {
  private _itemValidator: IValidator;
  private _minLength?: number;
  private _maxLength?: number;

  constructor(itemValidator: IValidator) {
    super();
    this._itemValidator = itemValidator;
  }

  min(n: number): this {
    this._minLength = n;
    return this;
  }

  max(n: number): this {
    this._maxLength = n;
    return this;
  }

  protected _validateType(value: unknown): string[] {
    if (!Array.isArray(value)) return [`Expected array, got ${typeof value}`];
    return [];
  }

  validate(value: unknown, ctx: ValidatorContext = { field: 'root', path: [] }): ValidationResult {
    if (value === undefined || value === null) {
      if (this._nullable && value === null) return { valid: true, errors: [], data: null };
      if (this._hasDefault) value = this._defaultValue;
      else if (this._optional) return { valid: true, errors: [], data: undefined as unknown };
      else return { valid: false, errors: [{ field: ctx.field, messages: [`${ctx.field} is required`] }], data: null };
    }

    if (!Array.isArray(value)) {
      return { valid: false, errors: [{ field: ctx.field, messages: [`Expected array, got ${typeof value}`] }], data: null };
    }

    const allErrors: { field: string; messages: string[] }[] = [];
    const validItems: unknown[] = [];

    if (this._minLength !== undefined && value.length < this._minLength)
      allErrors.push({ field: ctx.field, messages: [`${ctx.field} must have at least ${this._minLength} items`] });
    if (this._maxLength !== undefined && value.length > this._maxLength)
      allErrors.push({ field: ctx.field, messages: [`${ctx.field} must have at most ${this._maxLength} items`] });

    for (let i = 0; i < value.length; i++) {
      const itemCtx: ValidatorContext = {
        field: `${ctx.field}[${i}]`,
        path: [...ctx.path, ctx.field, String(i)],
      };
      const result = this._itemValidator.validate(value[i], itemCtx);
      if (!result.valid) {
        allErrors.push(...result.errors);
      } else {
        validItems.push(result.data);
      }
    }

    if (allErrors.length > 0) return { valid: false, errors: allErrors, data: null };
    return { valid: true, errors: [], data: validItems as T[] };
  }

  protected _validateRules(): string[] {
    return [];
  }

  protected _clone(): ArrayValidator<T> {
    const clone = new ArrayValidator<T>(this._itemValidator as IValidator);
    clone._optional = this._optional;
    clone._nullable = this._nullable;
    clone._hasDefault = this._hasDefault;
    clone._defaultValue = this._defaultValue;
    clone._transforms = [...this._transforms];
    clone._customValidators = [...this._customValidators];
    clone._refines = [...this._refines];
    clone._minLength = this._minLength;
    clone._maxLength = this._maxLength;
    return clone;
  }
}

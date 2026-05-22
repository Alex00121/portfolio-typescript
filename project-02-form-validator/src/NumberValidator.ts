import { BaseValidator } from './BaseValidator';
import { ValidatorContext } from './types';

export class NumberValidator extends BaseValidator<number> {
  private _min?: number;
  private _max?: number;
  private _integer = false;
  private _positive = false;

  min(n: number): this {
    this._min = n;
    return this;
  }

  max(n: number): this {
    this._max = n;
    return this;
  }

  integer(): this {
    this._integer = true;
    return this;
  }

  positive(): this {
    this._positive = true;
    return this;
  }

  protected _validateType(value: unknown): string[] {
    if (typeof value !== 'number' || isNaN(value)) return [`Expected number, got ${typeof value}`];
    return [];
  }

  protected _validateRules(value: number, ctx: ValidatorContext): string[] {
    const errors: string[] = [];
    if (this._min !== undefined && value < this._min)
      errors.push(`${ctx.field} must be at least ${this._min}`);
    if (this._max !== undefined && value > this._max)
      errors.push(`${ctx.field} must be at most ${this._max}`);
    if (this._integer && !Number.isInteger(value))
      errors.push(`${ctx.field} must be an integer`);
    if (this._positive && value <= 0)
      errors.push(`${ctx.field} must be a positive number`);
    return errors;
  }

  protected _clone(): NumberValidator {
    const clone = new NumberValidator();
    clone._optional = this._optional;
    clone._nullable = this._nullable;
    clone._hasDefault = this._hasDefault;
    clone._defaultValue = this._defaultValue;
    clone._transforms = [...this._transforms];
    clone._customValidators = [...this._customValidators];
    clone._refines = [...this._refines];
    clone._min = this._min;
    clone._max = this._max;
    clone._integer = this._integer;
    clone._positive = this._positive;
    return clone;
  }
}

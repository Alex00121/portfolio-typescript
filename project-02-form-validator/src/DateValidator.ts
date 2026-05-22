import { BaseValidator } from './BaseValidator';
import { ValidatorContext } from './types';

export class DateValidator extends BaseValidator<Date> {
  private _min?: Date;
  private _max?: Date;
  private _before?: Date;
  private _after?: Date;

  min(date: Date): this {
    this._min = date;
    return this;
  }

  max(date: Date): this {
    this._max = date;
    return this;
  }

  before(date: Date): this {
    this._before = date;
    return this;
  }

  after(date: Date): this {
    this._after = date;
    return this;
  }

  protected _validateType(value: unknown): string[] {
    if (value instanceof Date) {
      if (isNaN(value.getTime())) return ['Expected a valid date'];
      return [];
    }
    if (typeof value === 'string' || typeof value === 'number') {
      const d = new Date(value);
      if (!isNaN(d.getTime())) return [];
    }
    return [`Expected Date, got ${typeof value}`];
  }

  protected _validateRules(value: Date, ctx: ValidatorContext): string[] {
    const date = value instanceof Date ? value : new Date(value as unknown as string);
    const errors: string[] = [];
    if (this._min && date < this._min)
      errors.push(`${ctx.field} must be on or after ${this._min.toISOString().split('T')[0]}`);
    if (this._max && date > this._max)
      errors.push(`${ctx.field} must be on or before ${this._max.toISOString().split('T')[0]}`);
    if (this._before && date >= this._before)
      errors.push(`${ctx.field} must be before ${this._before.toISOString().split('T')[0]}`);
    if (this._after && date <= this._after)
      errors.push(`${ctx.field} must be after ${this._after.toISOString().split('T')[0]}`);
    return errors;
  }

  protected _clone(): DateValidator {
    const clone = new DateValidator();
    clone._optional = this._optional;
    clone._nullable = this._nullable;
    clone._hasDefault = this._hasDefault;
    clone._defaultValue = this._defaultValue;
    clone._transforms = [...this._transforms];
    clone._customValidators = [...this._customValidators];
    clone._refines = [...this._refines];
    clone._min = this._min;
    clone._max = this._max;
    clone._before = this._before;
    clone._after = this._after;
    return clone;
  }
}

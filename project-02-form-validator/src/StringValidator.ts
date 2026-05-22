import { BaseValidator } from './BaseValidator';
import { ValidatorContext } from './types';

export class StringValidator extends BaseValidator<string> {
  private _min?: number;
  private _max?: number;
  private _email = false;
  private _url = false;
  private _regex?: RegExp;
  private _trim = false;

  min(n: number): this {
    this._min = n;
    return this;
  }

  max(n: number): this {
    this._max = n;
    return this;
  }

  email(): this {
    this._email = true;
    return this;
  }

  url(): this {
    this._url = true;
    return this;
  }

  regex(pattern: RegExp): this {
    this._regex = pattern;
    return this;
  }

  trim(): this {
    this._trim = true;
    return this;
  }

  required(): this {
    return this;
  }

  protected _validateType(value: unknown): string[] {
    if (typeof value !== 'string') return [`Expected string, got ${typeof value}`];
    return [];
  }

  protected _preprocessValue(value: string): string {
    return this._trim ? value.trim() : value;
  }

  protected _validateRules(value: string, ctx: ValidatorContext): string[] {
    const errors: string[] = [];
    if (this._min !== undefined && value.length < this._min)
      errors.push(`${ctx.field} must be at least ${this._min} characters`);
    if (this._max !== undefined && value.length > this._max)
      errors.push(`${ctx.field} must be at most ${this._max} characters`);
    if (this._email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      errors.push(`${ctx.field} must be a valid email address`);
    if (this._url) {
      try {
        new URL(value);
      } catch {
        errors.push(`${ctx.field} must be a valid URL`);
      }
    }
    if (this._regex && !this._regex.test(value))
      errors.push(`${ctx.field} does not match the required pattern`);
    return errors;
  }

  protected _clone(): StringValidator {
    const clone = new StringValidator();
    clone._optional = this._optional;
    clone._nullable = this._nullable;
    clone._hasDefault = this._hasDefault;
    clone._defaultValue = this._defaultValue;
    clone._transforms = [...this._transforms];
    clone._customValidators = [...this._customValidators];
    clone._refines = [...this._refines];
    clone._min = this._min;
    clone._max = this._max;
    clone._email = this._email;
    clone._url = this._url;
    clone._regex = this._regex;
    clone._trim = this._trim;
    return clone;
  }
}

import { BaseValidator } from './BaseValidator';

export class BooleanValidator extends BaseValidator<boolean> {
  protected _validateType(value: unknown): string[] {
    if (typeof value !== 'boolean') return [`Expected boolean, got ${typeof value}`];
    return [];
  }

  protected _validateRules(): string[] {
    return [];
  }

  protected _clone(): BooleanValidator {
    const clone = new BooleanValidator();
    clone._optional = this._optional;
    clone._nullable = this._nullable;
    clone._hasDefault = this._hasDefault;
    clone._defaultValue = this._defaultValue;
    clone._transforms = [...this._transforms];
    clone._customValidators = [...this._customValidators];
    clone._refines = [...this._refines];
    return clone;
  }
}

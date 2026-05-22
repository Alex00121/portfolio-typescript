import { BaseValidator } from './BaseValidator';
import { ValidatorContext, ValidationResult, IValidator } from './types';

type SchemaMap = Record<string, IValidator>;

export class ObjectValidator<T extends Record<string, unknown>> extends BaseValidator<T> {
  private _schema: SchemaMap;

  constructor(schema: SchemaMap) {
    super();
    this._schema = schema;
  }

  validate(value: unknown, ctx: ValidatorContext = { field: 'root', path: [] }): ValidationResult {
    if (value === null) {
      if (this._nullable) return { valid: true, errors: [], data: null };
      return { valid: false, errors: [{ field: ctx.field, messages: [`${ctx.field} cannot be null`] }], data: null };
    }
    if (value === undefined) {
      if (this._hasDefault) value = this._defaultValue;
      else if (this._optional) return { valid: true, errors: [], data: undefined as unknown };
      else return { valid: false, errors: [{ field: ctx.field, messages: [`${ctx.field} is required`] }], data: null };
    }

    if (typeof value !== 'object' || Array.isArray(value)) {
      return { valid: false, errors: [{ field: ctx.field, messages: [`Expected object, got ${typeof value}`] }], data: null };
    }

    const allErrors: { field: string; messages: string[] }[] = [];
    const output: Record<string, unknown> = {};
    const prefix = ctx.field !== 'root' ? `${ctx.field}.` : '';

    for (const [key, validator] of Object.entries(this._schema)) {
      const fieldValue = (value as Record<string, unknown>)[key];
      const fieldCtx: ValidatorContext = {
        field: `${prefix}${key}`,
        path: [...ctx.path, key],
      };
      const result = validator.validate(fieldValue, fieldCtx);
      if (!result.valid) {
        allErrors.push(...result.errors);
      } else {
        if (result.data !== undefined) output[key] = result.data;
      }
    }

    if (allErrors.length > 0) return { valid: false, errors: allErrors, data: null };
    return this._applyPostValidation(output as unknown as T, ctx);
  }

  protected _validateType(): string[] {
    return [];
  }

  protected _validateRules(): string[] {
    return [];
  }

  protected _clone(): ObjectValidator<T> {
    const clone = new ObjectValidator<T>(this._schema);
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

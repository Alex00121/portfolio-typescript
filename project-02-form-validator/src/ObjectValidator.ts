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
    if (value === undefined || value === null) {
      if (this._nullable && value === null) return { valid: true, errors: [], data: null };
      if (this._hasDefault) value = this._defaultValue;
      else if (this._optional) return { valid: true, errors: [], data: undefined as unknown };
      else return { valid: false, errors: [{ field: ctx.field, messages: [`${ctx.field} is required`] }], data: null };
    }

    if (typeof value !== 'object' || Array.isArray(value)) {
      return { valid: false, errors: [{ field: ctx.field, messages: [`Expected object, got ${typeof value}`] }], data: null };
    }

    const allErrors: { field: string; messages: string[] }[] = [];
    const output: Record<string, unknown> = {};

    for (const [key, validator] of Object.entries(this._schema)) {
      const fieldValue = (value as Record<string, unknown>)[key];
      const fieldCtx: ValidatorContext = {
        field: ctx.path.length > 0 || ctx.field !== 'root' ? `${ctx.field}.${key}` : key,
        path: [...ctx.path, ctx.field !== 'root' ? ctx.field : '', key].filter(Boolean),
      };
      const result = validator.validate(fieldValue, fieldCtx);
      if (!result.valid) {
        allErrors.push(...result.errors);
      } else {
        if (result.data !== undefined) output[key] = result.data;
      }
    }

    if (allErrors.length > 0) return { valid: false, errors: allErrors, data: null };
    return { valid: true, errors: [], data: output as T };
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

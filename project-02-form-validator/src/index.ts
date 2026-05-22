import { StringValidator } from './StringValidator';
import { NumberValidator } from './NumberValidator';
import { BooleanValidator } from './BooleanValidator';
import { ArrayValidator } from './ArrayValidator';
import { ObjectValidator } from './ObjectValidator';
import { DateValidator } from './DateValidator';
import { IValidator } from './types';

export { StringValidator } from './StringValidator';
export { NumberValidator } from './NumberValidator';
export { BooleanValidator } from './BooleanValidator';
export { ArrayValidator } from './ArrayValidator';
export { ObjectValidator } from './ObjectValidator';
export { DateValidator } from './DateValidator';
export { BaseValidator } from './BaseValidator';
export type { ValidationResult, ValidatorContext, IValidator } from './types';

const v = {
  string: () => new StringValidator(),
  number: () => new NumberValidator(),
  boolean: () => new BooleanValidator(),
  date: () => new DateValidator(),
  array: <T>(itemValidator: IValidator) => new ArrayValidator<T>(itemValidator),
  object: <T extends Record<string, unknown>>(schema: Record<string, IValidator>) =>
    new ObjectValidator<T>(schema),
};

export default v;
export { v };

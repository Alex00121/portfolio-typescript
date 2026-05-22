import v from '../src/index';

// ─── String ───────────────────────────────────────────────────────────────────

describe('StringValidator', () => {
  test('valid string passes', () => {
    const result = v.string().validate('hello');
    expect(result.valid).toBe(true);
    expect(result.data).toBe('hello');
  });

  test('non-string fails', () => {
    const result = v.string().validate(42);
    expect(result.valid).toBe(false);
    expect(result.errors[0].messages[0]).toMatch(/Expected string/);
  });

  test('min length passes', () => {
    expect(v.string().min(3).validate('abc').valid).toBe(true);
  });

  test('min length fails', () => {
    const result = v.string().min(5).validate('hi');
    expect(result.valid).toBe(false);
    expect(result.errors[0].messages[0]).toMatch(/at least 5/);
  });

  test('max length passes', () => {
    expect(v.string().max(10).validate('hello').valid).toBe(true);
  });

  test('max length fails', () => {
    const result = v.string().max(3).validate('toolong');
    expect(result.valid).toBe(false);
    expect(result.errors[0].messages[0]).toMatch(/at most 3/);
  });

  test('valid email passes', () => {
    expect(v.string().email().validate('alex@example.com').valid).toBe(true);
  });

  test('invalid email fails', () => {
    const result = v.string().email().validate('not-an-email');
    expect(result.valid).toBe(false);
    expect(result.errors[0].messages[0]).toMatch(/valid email/);
  });

  test('valid url passes', () => {
    expect(v.string().url().validate('https://example.com').valid).toBe(true);
  });

  test('invalid url fails', () => {
    const result = v.string().url().validate('not-a-url');
    expect(result.valid).toBe(false);
    expect(result.errors[0].messages[0]).toMatch(/valid URL/);
  });

  test('regex passes', () => {
    expect(v.string().regex(/^[a-z0-9_]+$/).validate('abc_123').valid).toBe(true);
  });

  test('regex fails', () => {
    const result = v.string().regex(/^[a-z]+$/).validate('ABC');
    expect(result.valid).toBe(false);
    expect(result.errors[0].messages[0]).toMatch(/pattern/);
  });

  test('trim removes whitespace before validation', () => {
    expect(v.string().trim().min(3).validate('  hello  ').valid).toBe(true);
  });

  test('required string missing fails', () => {
    const result = v.string().validate(undefined);
    expect(result.valid).toBe(false);
    expect(result.errors[0].messages[0]).toMatch(/required/);
  });

  test('optional string missing passes', () => {
    const result = v.string().optional().validate(undefined);
    expect(result.valid).toBe(true);
    expect(result.data).toBeUndefined();
  });

  test('nullable string with null passes', () => {
    const result = v.string().nullable().validate(null);
    expect(result.valid).toBe(true);
    expect(result.data).toBeNull();
  });

  test('default value used when field missing', () => {
    const result = v.string().default('default-val').validate(undefined);
    expect(result.valid).toBe(true);
    expect(result.data).toBe('default-val');
  });
});

// ─── Number ───────────────────────────────────────────────────────────────────

describe('NumberValidator', () => {
  test('valid number passes', () => {
    expect(v.number().validate(42).valid).toBe(true);
  });

  test('string as number fails', () => {
    const result = v.number().validate('42');
    expect(result.valid).toBe(false);
    expect(result.errors[0].messages[0]).toMatch(/Expected number/);
  });

  test('min passes', () => {
    expect(v.number().min(18).validate(25).valid).toBe(true);
  });

  test('min fails', () => {
    const result = v.number().min(18).validate(16);
    expect(result.valid).toBe(false);
    expect(result.errors[0].messages[0]).toMatch(/at least 18/);
  });

  test('max passes', () => {
    expect(v.number().max(120).validate(30).valid).toBe(true);
  });

  test('max fails', () => {
    const result = v.number().max(100).validate(150);
    expect(result.valid).toBe(false);
    expect(result.errors[0].messages[0]).toMatch(/at most 100/);
  });

  test('integer passes', () => {
    expect(v.number().integer().validate(5).valid).toBe(true);
  });

  test('integer fails for float', () => {
    const result = v.number().integer().validate(3.14);
    expect(result.valid).toBe(false);
    expect(result.errors[0].messages[0]).toMatch(/integer/);
  });

  test('positive passes', () => {
    expect(v.number().positive().validate(1).valid).toBe(true);
  });

  test('positive fails for zero', () => {
    const result = v.number().positive().validate(0);
    expect(result.valid).toBe(false);
    expect(result.errors[0].messages[0]).toMatch(/positive/);
  });

  test('optional number missing passes', () => {
    expect(v.number().optional().validate(undefined).valid).toBe(true);
  });
});

// ─── Boolean ──────────────────────────────────────────────────────────────────

describe('BooleanValidator', () => {
  test('true passes', () => {
    expect(v.boolean().validate(true).valid).toBe(true);
  });

  test('false passes', () => {
    expect(v.boolean().validate(false).valid).toBe(true);
  });

  test('non-boolean fails', () => {
    const result = v.boolean().validate('true');
    expect(result.valid).toBe(false);
    expect(result.errors[0].messages[0]).toMatch(/Expected boolean/);
  });
});

// ─── Date ─────────────────────────────────────────────────────────────────────

describe('DateValidator', () => {
  test('valid Date object passes', () => {
    expect(v.date().validate(new Date('2024-01-01')).valid).toBe(true);
  });

  test('valid date string passes', () => {
    expect(v.date().validate('2024-06-15').valid).toBe(true);
  });

  test('invalid date string fails', () => {
    const result = v.date().validate('not-a-date');
    expect(result.valid).toBe(false);
  });

  test('min date passes', () => {
    const result = v.date().min(new Date('2020-01-01')).validate(new Date('2023-01-01'));
    expect(result.valid).toBe(true);
  });

  test('min date fails', () => {
    const result = v.date().min(new Date('2025-01-01')).validate(new Date('2020-01-01'));
    expect(result.valid).toBe(false);
    expect(result.errors[0].messages[0]).toMatch(/on or after/);
  });

  test('before date passes', () => {
    const result = v.date().before(new Date('2030-01-01')).validate(new Date('2025-01-01'));
    expect(result.valid).toBe(true);
  });

  test('after date fails', () => {
    const result = v.date().after(new Date('2025-01-01')).validate(new Date('2020-01-01'));
    expect(result.valid).toBe(false);
    expect(result.errors[0].messages[0]).toMatch(/after/);
  });
});

// ─── Array ────────────────────────────────────────────────────────────────────

describe('ArrayValidator', () => {
  test('valid array of strings passes', () => {
    const result = v.array(v.string()).validate(['a', 'b', 'c']);
    expect(result.valid).toBe(true);
    expect(result.data).toEqual(['a', 'b', 'c']);
  });

  test('invalid item in array fails with field path', () => {
    const result = v.array(v.string()).validate(['a', 42, 'c']);
    expect(result.valid).toBe(false);
    expect(result.errors[0].field).toMatch(/\[1\]/);
  });

  test('min length passes', () => {
    expect(v.array(v.string()).min(1).validate(['x']).valid).toBe(true);
  });

  test('min length fails', () => {
    const result = v.array(v.string()).min(3).validate(['a']);
    expect(result.valid).toBe(false);
    expect(result.errors[0].messages[0]).toMatch(/at least 3/);
  });

  test('max length fails', () => {
    const result = v.array(v.string()).max(2).validate(['a', 'b', 'c']);
    expect(result.valid).toBe(false);
    expect(result.errors[0].messages[0]).toMatch(/at most 2/);
  });

  test('non-array fails', () => {
    const result = v.array(v.string()).validate('not-array');
    expect(result.valid).toBe(false);
    expect(result.errors[0].messages[0]).toMatch(/Expected array/);
  });

  test('array of numbers validates each item', () => {
    const result = v.array(v.number().min(0)).validate([1, 2, -5]);
    expect(result.valid).toBe(false);
    expect(result.errors[0].field).toMatch(/\[2\]/);
  });
});

// ─── Object ───────────────────────────────────────────────────────────────────

describe('ObjectValidator', () => {
  const userSchema = v.object({
    username: v.string().min(3).max(20).regex(/^[a-z0-9_]+$/),
    email: v.string().email(),
    age: v.number().min(18).max(120).integer().optional(),
  });

  test('valid object passes', () => {
    const result = userSchema.validate({
      username: 'alex_dev',
      email: 'alex@example.com',
      age: 25,
    });
    expect(result.valid).toBe(true);
    expect((result.data as Record<string, unknown>)?.username).toBe('alex_dev');
  });

  test('missing required field fails', () => {
    const result = userSchema.validate({ username: 'alex_dev' });
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'email')).toBe(true);
  });

  test('invalid field value fails', () => {
    const result = userSchema.validate({ username: 'ab', email: 'alex@example.com' });
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'username')).toBe(true);
  });

  test('optional field can be omitted', () => {
    const result = userSchema.validate({ username: 'alex_dev', email: 'alex@example.com' });
    expect(result.valid).toBe(true);
  });

  test('nested object works', () => {
    const schema = v.object({
      name: v.string(),
      address: v.object({
        city: v.string(),
        zip: v.string().regex(/^\d{5}$/),
      }),
    });

    const result = schema.validate({
      name: 'Alexandre',
      address: { city: 'Paris', zip: '75001' },
    });
    expect(result.valid).toBe(true);
  });

  test('nested object invalid zip fails', () => {
    const schema = v.object({
      name: v.string(),
      address: v.object({
        city: v.string(),
        zip: v.string().regex(/^\d{5}$/),
      }),
    });

    const result = schema.validate({
      name: 'Alexandre',
      address: { city: 'Paris', zip: 'INVALID' },
    });
    expect(result.valid).toBe(false);
    expect(result.errors[0].field).toMatch(/zip/);
  });
});

// ─── Advanced features ────────────────────────────────────────────────────────

describe('Advanced features', () => {
  test('transform modifies value', () => {
    const result = v.string().transform((s: string) => s.toUpperCase()).validate('hello');
    expect(result.valid).toBe(true);
    expect(result.data).toBe('HELLO');
  });

  test('transform on number', () => {
    const result = v.number().transform((n: number) => n * 2).validate(5);
    expect(result.valid).toBe(true);
    expect(result.data).toBe(10);
  });

  test('custom validator passes', () => {
    const result = v.string().custom(val => val.startsWith('A'), 'Must start with A').validate('Alexandre');
    expect(result.valid).toBe(true);
  });

  test('custom validator fails with custom message', () => {
    const result = v.string().custom(val => val.startsWith('A'), 'Must start with A').validate('Bob');
    expect(result.valid).toBe(false);
    expect(result.errors[0].messages[0]).toBe('Must start with A');
  });

  test('custom validator returning string message fails', () => {
    const result = v.string().custom(val => val.length > 5 ? true : 'Too short custom').validate('hi');
    expect(result.valid).toBe(false);
    expect(result.errors[0].messages[0]).toBe('Too short custom');
  });

  test('refine passes', () => {
    const result = v.number().refine(n => n % 2 === 0, 'Must be even').validate(4);
    expect(result.valid).toBe(true);
  });

  test('refine fails', () => {
    const result = v.number().refine(n => n % 2 === 0, 'Must be even').validate(3);
    expect(result.valid).toBe(false);
    expect(result.errors[0].messages[0]).toBe('Must be even');
  });

  test('full schema example from spec', () => {
    const schema = v.object({
      username: v.string().min(3).max(20).regex(/^[a-z0-9_]+$/),
      email: v.string().email(),
      age: v.number().min(18).max(120).integer().optional(),
      tags: v.array(v.string().min(1)).min(1).max(10),
      address: v.object({
        city: v.string(),
        zip: v.string().regex(/^\d{5}$/),
      }),
    });

    const result = schema.validate({
      username: 'alex_00',
      email: 'alex@portfolio.dev',
      tags: ['typescript', 'react'],
      address: { city: 'Lyon', zip: '69001' },
    });

    expect(result.valid).toBe(true);
  });

  test('full schema with invalid data fails', () => {
    const schema = v.object({
      username: v.string().min(3).max(20).regex(/^[a-z0-9_]+$/),
      email: v.string().email(),
      tags: v.array(v.string().min(1)).min(1).max(10),
    });

    const result = schema.validate({
      username: 'a',
      email: 'not-valid',
      tags: [],
    });

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(2);
  });

  test('nullable with null returns null data', () => {
    const result = v.string().nullable().validate(null);
    expect(result.valid).toBe(true);
    expect(result.data).toBeNull();
  });

  test('default used for missing optional-with-default', () => {
    const result = v.number().default(0).validate(undefined);
    expect(result.valid).toBe(true);
    expect(result.data).toBe(0);
  });
});

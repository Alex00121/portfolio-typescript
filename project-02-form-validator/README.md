# form-validator

## Description

Bibliothèque de validation de données type-safe construite en TypeScript pur, sans aucune dépendance externe. Inspirée de Zod, elle permet de définir des schémas de validation chainables et d'obtenir des résultats structurés avec les erreurs par champ.

## Technologies utilisées

- **TypeScript 5** — typage générique, inférence avancée
- **Jest + ts-jest** — suite de tests (30+ cas)
- **Node.js** — environnement d'exécution
- Zéro dépendance en production

## Fonctionnalités

- Validation de types : `string`, `number`, `boolean`, `date`, `array`, `object`
- Modificateurs chaînables : `.min()`, `.max()`, `.email()`, `.url()`, `.regex()`, `.integer()`, `.positive()`, `.trim()`
- Avancé : `.optional()`, `.nullable()`, `.default(value)`, `.transform(fn)`, `.custom(fn, message)`, `.refine(fn, message)`
- Objets imbriqués avec chemin de champ précis (`address.zip`)
- Tableaux avec validation de chaque élément (chemin `tags[2]`)
- Résultat structuré : `{ valid, errors: [{ field, messages[] }], data }`
- Suite de tests complète avec 30+ cas

## Installation

```bash
cd project-02-form-validator
npm install
```

## Lancer le projet

```bash
# Lancer les tests
npm test

# Lancer les tests avec couverture
npm run test:coverage

# Compiler en JavaScript
npm run build
```

## Aperçu

### API de base

```typescript
import v from './src';

// Schéma simple
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

// result: { valid: true, errors: [], data: { username: 'alex_00', ... } }
```

### Cas d'erreur

```typescript
const result = schema.validate({
  username: 'a',        // trop court
  email: 'invalide',   // pas un email
  tags: [],            // tableau vide interdit
});

// result: {
//   valid: false,
//   errors: [
//     { field: 'username', messages: ['username must be at least 3 characters'] },
//     { field: 'email',    messages: ['email must be a valid email address'] },
//     { field: 'tags',     messages: ['tags must have at least 1 items'] },
//   ],
//   data: null
// }
```

### Fonctionnalités avancées

```typescript
// Transform
const result = v.string().transform(s => s.toUpperCase()).validate('hello');
// result.data === 'HELLO'

// Custom validator
v.string().custom(val => val.startsWith('A'), 'Doit commencer par A')

// Refine
v.number().refine(n => n % 2 === 0, 'Doit être pair')

// Nullable + default
v.string().nullable().validate(null)   // valid, data: null
v.string().default('défaut').validate(undefined)  // valid, data: 'défaut'
```

### Résultats des tests

```
PASS  tests/validator.test.ts
  StringValidator     ✓ 14 tests
  NumberValidator     ✓ 9 tests
  BooleanValidator    ✓ 3 tests
  DateValidator       ✓ 7 tests
  ArrayValidator      ✓ 6 tests
  ObjectValidator     ✓ 6 tests
  Advanced features   ✓ 12 tests
```

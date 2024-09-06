# Array Utils
[中文文档](https://github.com/JsonLee12138/frontend-factory/blob/main/packages/utils/docs/arr/README.md)

## Overview

This file contains three main utility functions designed to work with arrays of objects. These utilities can help with transforming, picking, and omitting properties of objects in an array. The utilities support deep transformations for nested objects and use configurable key mappings.

### Functions

- **arrTransform**: Transforms an array of objects based on a mapping provided, with optional support for deep transformation of nested objects.
- **arrPick**: Selects specific keys from an array of objects and returns a new array with only the specified keys.
- **arrOmit**: Omits specified keys from an array of objects and returns a new array excluding the specified keys.

### arrTransform

#### Parameters:
- `data: S[]`: Array of source objects to be transformed.
- `format: Record<string, string>`: Object defining the mapping between source and target keys. Keys are target keys, values are source keys.
- `deep?: boolean`: Optional, specifies whether to perform deep transformation on nested objects (default is `false`).
- `childrenKey?: KeyConfig`: Optional, key configuration for handling nested objects, with `source` and `target` keys (default is `{source: 'children', target: 'children'}`).

#### Returns:
- `T[]`: The transformed array of objects.

#### Example Usage:
```typescript
const data = [
  { name: 'John', age: 30, children: [{ name: 'Anna' }] },
];
const format = { fullName: 'name', age: 'age' };
const transformed = arrTransform(data, format);
```

### arrPick

#### Parameters:
- `data: T[]`: Array of objects to pick keys from.
- `keys: string[]`: Array of keys to pick from each object.

#### Returns:
- `Array<AnyObject>`: New array of objects with only the specified keys.

#### Example Usage:
```typescript
const data = [
  { name: 'John', age: 30, location: 'New York' },
];
const picked = arrPick(data, ['name', 'age']);
```

### arrOmit

#### Parameters:
- `data: T[]`: Array of objects to omit keys from.
- `keys: string[]`: Array of keys to omit from each object.

#### Returns:
- `Array<AnyObject>`: New array of objects excluding the specified keys.

#### Example Usage:
```typescript
const data = [
  { name: 'John', age: 30, location: 'New York' },
];
const omitted = arrOmit(data, ['location']);
```

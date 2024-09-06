# Object Utils
[中文文档](https://github.com/JsonLee12138/frontend-factory/blob/main/packages/utils/docs/obj/README.md)

## Overview

This file includes two utility functions that work with individual objects, enabling developers to either omit or pick specific keys from an object and return a new object with or without the specified keys. These functions can be useful for data manipulation when only certain properties of an object are required.

### Functions

1. **objOmit**: Omits specified keys from an object and returns a new object excluding those keys.
2. **objPick**: Picks specified keys from an object and returns a new object with only those keys.

### objOmit

#### Parameters:
- `data: T`: The object from which keys will be omitted.
- `keys: (keyof T)[]`: An array of keys that should be omitted from the object.

#### Returns:
- `Omit<T, (typeof keys)[number]>`: A new object that does not include the specified keys.

#### Example Usage:
```typescript
const data = {
  name: 'John',
  age: 30,
  location: 'New York',
};
const omitted = objOmit(data, ['location']);
// Output: { name: 'John', age: 30 }
```

### objPick

#### Parameters:
- `data: T`: The object from which keys will be picked.
- `keys: (keyof T)[]`: An array of keys that should be picked from the object.

#### Returns:
- `Pick<T, (typeof keys)[number]>`: A new object that contains only the specified keys.

#### Example Usage:
```typescript
const data = {
  name: 'John',
  age: 30,
  location: 'New York',
};
const picked = objPick(data, ['name', 'age']);
// Output: { name: 'John', age: 30 }
```

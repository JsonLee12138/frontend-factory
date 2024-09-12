# Array Utils
[中文文档](https://github.com/JsonLee12138/frontend-factory/blob/main/packages/utils/docs/arr/README.md)

## Overview

This file contains several main utility functions designed to work with arrays of objects. These utilities can help with transforming, picking, grouping, and omitting properties of objects in an array. The utilities support deep transformations for nested objects and use configurable key mappings.

### Functions

- **arrTransform**: Transforms an array of objects based on a mapping provided, with optional support for deep transformation of nested objects.
- **arrPick**: Selects specific keys from an array of objects and returns a new array with only the specified keys.
- **arrOmit**: Omits specified keys from an array of objects and returns a new array excluding the specified keys.
- **group**: Groups an array of objects by a specified key and allows the use of either a WeakMap or a Map.
- **flatEach**: Recursively iterates over an array of objects, calling a callback for each item.
- **flatFilterByChildren**: Recursively filters an array of objects based on a callback, optionally filtering their children.

### arrTransform

#### Parameters:
- `data: S[]`: Array of source objects to be transformed.
- `format: Record<string, string | function(S): any>`: Defines the mapping relationship between source object keys and target object keys. The key is the key name of the target object and the value is the key name of the source object or a function to convert the value.
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

### group (Not recommended at this time)

#### Parameters:
- `data: T[]`: Array of objects to group.
- `options?: { groupBy?: string, keyIsObject?: boolean }`: Grouping options. `groupBy` specifies the key to group by, and `keyIsObject` specifies whether to use a WeakMap (default is `false`).

#### Returns:
- `WeakMap<K, T[]> | Map<PropertyKey, T[]>`: A WeakMap or Map, where each key is a group value, and the value is an array of objects in that group.

#### Example Usage:
```typescript
const data = [
  { name: 'John', group: 'A' },
  { name: 'Jane', group: 'B' },
  { name: 'Doe', group: 'A' },
];
const grouped = group(data, { groupBy: 'group' });
```

### flatEach

#### Parameters:
- `data: T[]`: Array of objects to iterate over.
- `callback: (item: T) => boolean | void`: Callback function to call for each item. If it returns `true`, iteration stops.
- `options: { childrenKey?: string }`: Options to control iteration behavior. `childrenKey` is used to access the key of child nodes.

#### Returns:
- `boolean`: If the callback function returns `true` for any item, returns `true`, otherwise returns `false`.

#### Example Usage:
```typescript
const data = [
  { name: 'John', children: [{ name: 'Anna' }] },
  { name: 'Jane' },
];
const found = flatEach(data, (item) => item.name === 'Anna', { childrenKey: 'children' });
```

### flatFilterByChildren

#### Parameters:
- `data: T[]`: Array of objects to filter.
- `callback: (item: T) => boolean`: Callback function to determine whether each item should be included in the result.
- `options: { childrenKey?: string, deep?: boolean }`: Options to control filtering behavior. `childrenKey` is used to access the key of child nodes, and `deep` specifies whether to recursively apply filtering to child nodes.

#### Returns:
- `T[]`: Filtered array of objects, including any filtered child nodes.

#### Example Usage:
```typescript
const data = [
  { name: 'John', children: [{ name: 'Anna' }] },
  { name: 'Jane' },
];
const filtered = flatFilterByChildren(data, (item) => item.name.includes('J'), { childrenKey: 'children', deep: true });
```

# String Utils
[中文文档](https://github.com/JsonLee12138/frontend-factory/blob/main/packages/utils/docs/str/README.md)

## Overview

This utility function is designed to convert a string into camelCase format, with an optional feature to capitalize the first letter of the resulting string. It leverages Lodash's `_camelCase` function to handle the camel casing.

### Function

- **camelCase**: Converts a string to camelCase format and can optionally capitalize the first letter.

### camelCase

#### Parameters:
- `str: string`: The string to be converted to camelCase.
- `upper?: boolean`: Optional parameter (default: `false`). If `true`, the first letter of the resulting string will be capitalized.

#### Returns:
- `string`: The camelCase formatted string, with the first letter optionally capitalized.

#### Example Usage:
```typescript
const result1 = camelCase('hello world');
// Output: 'helloWorld'

const result2 = camelCase('hello world', true);
// Output: 'HelloWorld'
```

# String Utils
[English Document](https://github.com/JsonLee12138/frontend-factory/blob/main/packages/utils/docs/str/README.en.md)

## 概述

此工具函数用于将字符串转换为驼峰格式，并可以选择将结果字符串的首字母大写。它使用 Lodash 的 `_camelCase` 函数来处理驼峰格式转换。

### 函数

- **camelCase**: 将字符串转换为驼峰格式，并可以选择将首字母大写。

### camelCase

#### 参数：
- `str: string`: 要转换为驼峰格式的字符串。
- `upper?: boolean`: 可选参数（默认值：`false`）。如果为 `true`，结果字符串的首字母将被大写。

#### 返回值：
- `string`: 驼峰格式的字符串，可选择首字母大写。

#### 示例用法：
```typescript
const result1 = camelCase('hello world');
// 输出: 'helloWorld'

const result2 = camelCase('hello world', true);
// 输出: 'HelloWorld'
```

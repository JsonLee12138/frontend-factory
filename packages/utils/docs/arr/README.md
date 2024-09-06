# Array Utils
[English Document](https://github.com/JsonLee12138/frontend-factory/blob/main/packages/utils/docs/arr/README.en.md)

## 概述

该文件包含三个主要的工具函数，专为处理对象数组设计。它们可以帮助转换、筛选和省略数组中的对象属性。工具函数支持嵌套对象的深度转换，并使用可配置的键映射。

### 函数

- **arrTransform**: 根据提供的映射转换对象数组，支持对嵌套对象的深度转换。
- **arrPick**: 从对象数组中选择指定的键，并返回仅包含这些键的对象数组。
- **arrOmit**: 从对象数组中省略指定的键，并返回不包含这些键的对象数组。

### arrTransform

#### 参数：
- `data: S[]`: 要转换的源对象数组。
- `format: Record<string, string>`: 定义源对象键与目标对象键的映射关系。键是目标对象的键名，值是源对象的键名。
- `deep?: boolean`: 可选参数，指定是否对嵌套对象执行深度转换（默认值为 `false`）。
- `childrenKey?: KeyConfig`: 可选参数，用于处理嵌套对象的键配置，包含 `source` 和 `target` 键（默认值为 `{source: 'children', target: 'children'}`）。

#### 返回值：
- `T[]`: 转换后的对象数组。

#### 示例用法：
```typescript
const data = [
  { name: 'John', age: 30, children: [{ name: 'Anna' }] },
];
const format = { fullName: 'name', age: 'age' };
const transformed = arrTransform(data, format);
```

### arrPick

#### 参数：
- `data: T[]`: 要从中选择键的对象数组。
- `keys: string[]`: 要从每个对象中选择的键数组。

#### 返回值：
- `Array<AnyObject>`: 包含指定键的新对象数组。

#### 示例用法：
```typescript
const data = [
  { name: 'John', age: 30, location: 'New York' },
];
const picked = arrPick(data, ['name', 'age']);
```

### arrOmit

#### 参数：
- `data: T[]`: 要从中省略键的对象数组。
- `keys: string[]`: 要从每个对象中省略的键数组。

#### 返回值：
- `Array<AnyObject>`: 不包含指定键的新对象数组。

#### 示例用法：
```typescript
const data = [
  { name: 'John', age: 30, location: 'New York' },
];
const omitted = arrOmit(data, ['location']);
```

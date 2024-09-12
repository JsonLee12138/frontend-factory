# Array Utils
[English Document](https://github.com/JsonLee12138/frontend-factory/blob/main/packages/utils/docs/arr/README.en.md)

## 概述

该文件包含多个主要的工具函数，专为处理对象数组设计。它们可以帮助转换、筛选、分组和省略数组中的对象属性。工具函数支持嵌套对象的深度转换，并使用可配置的键映射。

### 函数

- **arrTransform**: 根据提供的映射转换对象数组，支持对嵌套对象的深度转换。
- **arrPick**: 从对象数组中选择指定的键，并返回仅包含这些键的对象数组。
- **arrOmit**: 从对象数组中省略指定的键，并返回不包含这些键的对象数组。
- **group**: 根据指定的键对对象数组进行分组，并允许使用 WeakMap 或 Map。
- **flatEach**: 递归地遍历对象数组，并为每个项调用回调函数。
- **flatFilterByChildren**: 递归地根据回调函数过滤对象数组，选择性地过滤它们的子节点。

### arrTransform

#### 参数：
- `data: S[]`: 要转换的源对象数组。
- `format: Record<string, string | function(S): any>`: 定义源对象键与目标对象键的映射关系。键是目标对象的键名，值是源对象的键名或一个函数用于转换值。
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

### group (暂不推荐使用)

#### 参数：
- `data: T[]`: 要分组的对象数组。
- `options?: { groupBy?: string, keyIsObject?: boolean }`: 分组选项。`groupBy` 指定用于分组的键，`keyIsObject` 指定是否使用 WeakMap（默认为 `false`）。

#### 返回值：
- `WeakMap<K, T[]> | Map<PropertyKey, T[]>`: 一个 WeakMap 或 Map，每个键是一个分组的值，值是该分组中的对象数组。

#### 示例用法：
```typescript
const data = [
  { name: 'John', group: 'A' },
  { name: 'Jane', group: 'B' },
  { name: 'Doe', group: 'A' },
];
const grouped = group(data, { groupBy: 'group' });
```

### flatEach

#### 参数：
- `data: T[]`: 要遍历的对象数组。
- `callback: (item: T) => boolean | void`: 为每个项调用的函数。如果返回 `true`，遍历停止。
- `options: { childrenKey?: string }`: 控制迭代行为的选项。`childrenKey` 用于访问对象中子节点的键名。

#### 返回值：
- `boolean`: 如果回调函数对某一项返回 `true`，则返回 `true`，否则返回 `false`。

#### 示例用法：
```typescript
const data = [
  { name: 'John', children: [{ name: 'Anna' }] },
  { name: 'Jane' },
];
const found = flatEach(data, (item) => item.name === 'Anna', { childrenKey: 'children' });
```

### flatFilterByChildren

#### 参数：
- `data: T[]`: 要过滤的对象数组。
- `callback: (item: T) => boolean`: 为每个项调用的函数，决定其是否应被包括在结果中。
- `options: { childrenKey?: string, deep?: boolean }`: 控制过滤行为的选项。`childrenKey` 用于访问对象中子节点的键名，`deep` 指定是否递归地对子节点应用过滤。

#### 返回值：
- `T[]`: 返回过滤后的对象数组，包括任何被过滤的子节点。

#### 示例用法：
```typescript
const data = [
  { name: 'John', children: [{ name: 'Anna' }] },
  { name: 'Jane' },
];
const filtered = flatFilterByChildren(data, (item) => item.name.includes('J'), { childrenKey: 'children', deep: true });
```

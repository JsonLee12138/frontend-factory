# Object Utils
[English Document](https://github.com/JsonLee12138/frontend-factory/blob/main/packages/utils/docs/obj/README.en.md)

## 概述

该文件包含两个用于处理单个对象的工具函数，允许开发者省略或选择对象中的特定键，并返回一个包含或不包含这些键的新对象。当只需要对象的某些属性时，这些函数对于数据操作非常有用。

### 函数

1. **objOmit**: 从对象中省略指定的键，并返回一个不包含这些键的新对象。
2. **objPick**: 从对象中选择指定的键，并返回一个仅包含这些键的新对象。

### objOmit

#### 参数：
- `data: T`: 要从中省略键的对象。
- `keys: (keyof T)[]`: 要从对象中省略的键数组。

#### 返回值：
- `Omit<T, (typeof keys)[number]>`: 一个新的对象，不包含指定的键。

#### 示例用法：
```typescript
const data = {
  name: 'John',
  age: 30,
  location: 'New York',
};
const omitted = objOmit(data, ['location']);
// 输出: { name: 'John', age: 30 }
```

### objPick

#### 参数：
- `data: T`: 要从中选择键的对象。
- `keys: (keyof T)[]`: 要从对象中选择的键数组。

#### 返回值：
- `Pick<T, (typeof keys)[number]>`: 一个新的对象，其中仅包含指定的键。

#### 示例用法：
```typescript
const data = {
  name: 'John',
  age: 30,
  location: 'New York',
};
const picked = objPick(data, ['name', 'age']);
// 输出: { name: 'John', age: 30 }
```

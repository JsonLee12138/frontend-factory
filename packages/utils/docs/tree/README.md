# Tree Utils
[English Document](https://github.com/JsonLee12138/frontend-factory/blob/main/packages/utils/docs/tree/README.en.md)

## 概述

该文件包含两个主要的工具函数，用于处理树形结构的数据。这些工具函数可以将平面对象数组绑定为基于父子关系的树形结构，并从树形结构的对象数组中省略指定的键。

### 函数

1. **treeBind**: 根据父子关系将平面对象数组绑定为树形结构。
2. **treeOmit**: 从树形结构的对象数组中省略指定的键，并返回不包含这些键的新树。
3. **treeFlatten**: 将树结构展平成一维数组。

### treeBind

#### 参数：
- `data: T[]`: 要转换为树形结构的平面对象数组。
- `options?: Partial<TreeBindingOptions>`: 可选的键名配置。
  - `idKey: string = 'id'`: 用于标识每个节点唯一 ID 的键。
  - `parentKey: string = 'parentId'`: 用于标识每个节点父级 ID 的键。
  - `childrenKey: string = 'children'`: 用于存储每个节点子节点的键。

#### 返回值：
- `T[]`: 树形结构的对象数组，其中父节点包含它们的子节点。

#### 示例用法：
```typescript
const data = [
  { id: 1, name: 'Parent', parentId: null },
  { id: 2, name: 'Child', parentId: 1 },
];
const tree = treeBind(data);
// 输出: [{ id: 1, name: 'Parent', children: [{ id: 2, name: 'Child' }] }]
```

### treeOmit

#### 参数：
- `data: T[]`: 要从中省略键的树形结构对象数组。
- `keys: string[]`: 要从树中每个对象中省略的键数组。
- `options?: Pick<TreeBindingOptions, 'childrenKey'>`: 可选的子节点键配置。
  - `childrenKey: string = 'children'`: 用于存储树中子节点的键。

#### 返回值：
- `T[]`: 一个新的树形结构对象数组，不包含指定的键。

#### 示例用法：
```typescript
const tree = [
  { id: 1, name: 'Parent', children: [{ id: 2, name: 'Child' }] },
];
const newTree = treeOmit(tree, ['name']);
// 输出: [{ id: 1, children: [{ id: 2 }] }]
```

### treeFlatten

#### 参数：
- `data: T[]`: 要展开的树结构数组。
- `options?: Object`: 可选参数，用于配置展开过程。
  - `childrenKey?: string`: 用于标识树结构中子节点的键，默认为 `'children'`。
  - `keepChildren?: boolean`: 是否在展平的项中保留 `children` 键，默认为 `false`。

#### 返回值：
- `T[]`: 展平后的树节点数组。

#### 示例用法：
```typescript
const data = [
  { name: 'John', children: [{ name: 'Anna' }] },
  { name: 'Mike', children: [{ name: 'Chris', children: [{ name: 'Tom' }] }] },
];
const flattened = treeFlatten(data, { keepChildren: false });
```

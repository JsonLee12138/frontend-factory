# Tree Utils
[中文文档](https://github.com/JsonLee12138/frontend-factory/blob/main/packages/utils/docs/tree/README.md)

## Overview

This file contains two main utility functions for working with tree-structured data. These utilities allow you to bind a flat array of objects into a tree structure based on parent-child relationships and to omit specific keys from a tree-structured array of objects.

### Functions

1. **treeBind**: Binds a flat array of objects into a tree structure based on parent-child relationships.
2. **treeOmit**: Omits specified keys from a tree-structured array of objects and returns a new tree without those keys.

### treeBind

#### Parameters:
- `data: T[]`: A flat array of objects to be transformed into a tree structure.
- `options?: Partial<TreeBindingOptions>`: Optional configuration for the key names used in the transformation.
  - `idKey: string = 'id'`: The key used to identify each node's unique ID.
  - `parentKey: string = 'parentId'`: The key used to identify each node's parent ID.
  - `childrenKey: string = 'children'`: The key used to store each node's children.

#### Returns:
- `T[]`: A tree-structured array of objects, where parent nodes contain their child nodes.

#### Example Usage:
```typescript
const data = [
  { id: 1, name: 'Parent', parentId: null },
  { id: 2, name: 'Child', parentId: 1 },
];
const tree = treeBind(data);
// Output: [{ id: 1, name: 'Parent', children: [{ id: 2, name: 'Child' }] }]
```

### treeOmit

#### Parameters:
- `data: T[]`: The tree-structured array of objects from which keys will be omitted.
- `keys: string[]`: An array of keys to omit from each object in the tree.
- `options?: Pick<TreeBindingOptions, 'childrenKey'>`: Optional configuration for the key used to identify child nodes in the tree.
  - `childrenKey: string = 'children'`: The key used to store child nodes in the tree.

#### Returns:
- `T[]`: A new tree-structured array of objects excluding the specified keys.

#### Example Usage:
```typescript
const tree = [
  { id: 1, name: 'Parent', children: [{ id: 2, name: 'Child' }] },
];
const newTree = treeOmit(tree, ['name']);
// Output: [{ id: 1, children: [{ id: 2 }] }]
```

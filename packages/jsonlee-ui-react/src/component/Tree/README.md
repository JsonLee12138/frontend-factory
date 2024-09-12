# Tree 组件文档
[English Document](https://github.com/JsonLee12138/frontend-factory/blob/main/packages/jsonlee-ui-react/component/Tree/README.en.md)

## 概述

`Tree` 是一个功能强大且高度可定制的树形组件，集成了节点选择、展开/折叠功能和自定义操作。它旨在高效处理复杂的树形数据，允许动态更新、滚动操作以及自定义渲染函数。通过新增的功能，`Tree` 现在可以作为一个包含多个子组件的集合使用，进一步提升了其灵活性和可扩展性。

## 属性

| 名称               | 类型                                          | 描述                                                                                      |
|--------------------|-----------------------------------------------|------------------------------------------------------------------------------------------|
| `checked`          | `Key[]`                                       | 已选中的节点键值数组。                                                                    |
| `treeData`         | `T[]`                                         | 树形数据源。                                                                              |
| `optionsFormat`    | `object`                                      | 用于格式化树形数据的选项。                                                                |
| `onCheckedAllChange` | `function`                                  | 当全选状态改变时的回调函数。                                                              |
| `defaultExpandAll` | `boolean`                                     | 是否默认展开所有节点。                                                                    |
| `virtual`          | `boolean`                                     | 是否启用虚拟滚动。                                                                        |
| `...props`         | `object`                                      | 传递给底层 Ant Design [`Tree`](https://ant.design/components/tree-cn#api) 组件的其他属性。|

## 方法

`Tree` 组件通过 `ref` 提供以下几个方法：

1. **getCheckedKeys()**: 获取当前选中的节点键值。
2. **collapseAll()**: 折叠所有节点。
3. **expandAll()**: 展开所有节点。
4. **checkAll()**: 全选所有节点。
5. **unCheckAll()**: 取消全选所有节点。

## 示例用法
```typescript
import { Tree } from 'jsonlee-ui-react';
const MyComponent = () => {
  const treeRef = useRef(null);
  const treeData = [
    { title: '节点1', key: '0-0' },
    { title: '节点2', key: '0-1' },
  ];
  return (
    <Tree
      ref={treeRef}
      treeData={treeData}
      checked={['0-0']}
      defaultExpandAll
    />
  );
};
```

### 说明

1. **高度可定制**: 该组件允许高度灵活的配置，例如自定义节点、展开/折叠和全选操作。通过子组件的加入，可以在树形结构的各个部分添加自定义操作和内容。
2. **动态更新**: 通过 `getCheckedKeys` 方法，可以动态获取当前选中的节点键值。
3. **滚动控制**: `collapseAll` 和 `expandAll` 方法允许控制树形结构的展开和折叠，适用于处理大数据集。
4. **子组件扩展**: 新增的子组件（如 `Node`, `Title`, `Tools` 等）允许开发者进一步扩展树形结构的功能和界面。

### 依赖

- **Ant Design**: 使用了 `Tree` 相关组件。
- **自定义钩子**: 使用了 `useMemo`、`useRef` 和 `useImperativeHandle` 等 React 钩子进行优化和 ref 转发。

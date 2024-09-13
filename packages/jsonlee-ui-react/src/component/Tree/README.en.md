# Tree Component Documentation
[中文文档](https://github.com/JsonLee12138/frontend-factory/blob/main/packages/jsonlee-ui-react/component/Tree/README.md)

## Overview

`Tree` is a highly customizable and feature-rich tree component that integrates node selection, expand/collapse functionality, custom actions, and more. It is designed to handle complex tree data efficiently and provides a range of options, including dynamic updates, scroll actions, and custom rendering functions. With the latest updates, `Tree` now includes a set of sub-components that can be used individually or together, offering even greater flexibility and extensibility.

## Props

| Name               | Type                                          | Description                                                                                  |
|--------------------|-----------------------------------------------|----------------------------------------------------------------------------------------------|
| `checkedKeys`          | `Key[]`                                       | Array of keys of the checked nodes.                                                          |
| `treeData`         | `T[]`                                         | The data source for the tree.                                                                |
| `optionsFormat`    | `object`                                      | Options for formatting the tree data.                                                        |
| `onCheckedAllChange` | `function`                                  | Callback function when the check-all state changes.                                          |
| `defaultExpandAll` | `boolean`                                     | Whether to expand all nodes by default.                                                      |
| `virtual`          | `boolean`                                     | Whether to enable virtual scrolling.                                                         |
| `...props`         | `object`                                      | Additional properties passed to the underlying Ant Design [`Tree`](https://ant.design/components/tree-cn#api) component. |

## Methods

The `Tree` component exposes the following methods via `ref`:

1. **getCheckedKeys()**: Gets the keys of the currently checked nodes.
2. **collapseAll()**: Collapses all nodes.
3. **expandAll()**: Expands all nodes.
4. **checkAll()**: Checks all nodes.
5. **unCheckAll()**: Unchecks all nodes.

## Example Usage

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
      checkedKeys={['0-0']}
      defaultExpandAll
    />
  );
};
```

## Explanation

1. **Highly Customizable**: The component allows for flexible configurations, such as custom nodes, expand/collapse, and check-all operations. With the addition of sub-components, custom actions and content can be added to various parts of the tree structure.
2. **Dynamic Updates**: The `getCheckedKeys` method enables dynamic retrieval of the currently checked node keys.
3. **Scroll Control**: The `collapseAll` and `expandAll` methods allow for control over the expansion and collapse of the tree structure, making it ideal for handling large datasets.
4. **Subcomponent Extension**: The new sub-components (`Node`, `Title`, `Tools`, etc.) allow developers to further extend the functionality and appearance of the tree structure.

## Dependencies

- **Ant Design**: Utilizes `Tree` related components.
- **Custom Hooks**: Implements React hooks like `useMemo`, `useRef`, and `useImperativeHandle` for performance optimizations and ref forwarding.

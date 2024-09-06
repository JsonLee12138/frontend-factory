# TreeSelect Component Documentation
[中文文档](https://github.com/JsonLee12138/frontend-factory/blob/main/packages/jsonlee-ui-react/component/TreeSelect/README.md)

## Overview

The `TreeSelect` component is a wrapper around Ant Design's `TreeSelect`, providing additional flexibility to transform the options data into a tree structure. It uses the `arrTransform` utility to map custom key names for `label`, `value`, and `children` fields, enabling dynamic configurations for tree data rendering.

## Props

| Name             | Type                   | Description                                                                 |
|------------------|------------------------|-----------------------------------------------------------------------------|
| `valueKey`       | `string`               | The key used to map the value of each tree node. Defaults to `value`.        |
| `labelKey`       | `string`               | The key used to map the label of each tree node. Defaults to `label`.        |
| `childrenKey`    | `string`               | The key used to map the children of each tree node. Defaults to `children`.  |
| `options`        | `T[]`                  | The array of options used to construct the tree structure.                   |
| `width`          | `string` or `number`   | The width of the TreeSelect component.                                       |
| `placeholder`    | `string`               | The placeholder text to display when no value is selected.                   |
| `value`          | `string` or `number`   | The currently selected value.                                                |
| `onChange`       | `function`             | Callback function triggered when the value changes.                          |
| `...props`       | `ASelectProps`         | Additional props passed to the underlying Ant Design [`TreeSelect`](https://ant.design/components/tree-select-cn#api) component. |

## Usage Example

```typescript
import TreeSelect from './TreeSelect';

const MyComponent = () => {
  const options = [
    { id: 1, name: 'Node 1', subNodes: [{ id: 2, name: 'Node 1.1' }] },
  ];

  const handleChange = (value: string | number) => {
    console.log('Selected Value:', value);
  };

  return (
    <TreeSelect
      valueKey="id"
      labelKey="name"
      childrenKey="subNodes"
      options={options}
      width="100%"
      placeholder="Select a node"
      onChange={handleChange}
    />
  );
};
```

### Explanation

1. **Dynamic Key Mapping**: The component allows mapping of custom keys for `value`, `label`, and `children` fields using the `valueKey`, `labelKey`, and `childrenKey` props. This provides flexibility when dealing with different data structures.
2. **Tree Data Transformation**: The `arrTransform` utility transforms the flat options array into a tree structure by mapping the keys according to the provided configuration.
3. **Ant Design Integration**: All additional props are passed directly to Ant Design's `TreeSelect` component, allowing for full customization of its behavior and appearance.

### Dependencies

- **Ant Design Components**: Uses `TreeSelect` from Ant Design.
- **`arrTransform` Utility**: Used for transforming the options array into a tree structure.

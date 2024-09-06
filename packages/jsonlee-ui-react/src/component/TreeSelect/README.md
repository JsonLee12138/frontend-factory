# TreeSelect 组件文档
[English Document](https://github.com/JsonLee12138/frontend-factory/blob/main/packages/jsonlee-ui-react/component/TreeSelect/README.en.md)

## 概述

`TreeSelect` 组件是对 Ant Design 的 `TreeSelect` 的封装，提供了将选项数据转换为树形结构的功能。它使用 `arrTransform` 工具根据自定义的键名映射 `label`、`value` 和 `children` 字段，方便动态配置树形数据的渲染。

## 属性

| 名称             | 类型                   | 描述                                                                       |
|------------------|------------------------|----------------------------------------------------------------------------|
| `valueKey`       | `string`               | 用于映射每个树节点的值的键。默认值为 `value`。                              |
| `labelKey`       | `string`               | 用于映射每个树节点标签的键。默认值为 `label`。                              |
| `childrenKey`    | `string`               | 用于映射每个树节点子节点的键。默认值为 `children`。                         |
| `options`        | `T[]`                  | 用于构建树形结构的选项数组。                                                |
| `width`          | `string` 或 `number`   | `TreeSelect` 组件的宽度。                                                   |
| `placeholder`    | `string`               | 未选择值时显示的占位符文本。                                                |
| `value`          | `string` 或 `number`   | 当前选中的值。                                                              |
| `onChange`       | `function`             | 当值发生变化时触发的回调函数。                                               |
| `...props`       | `ASelectProps`         | 传递给底层 Ant Design [`TreeSelect`](https://ant.design/components/tree-select-cn#api) 组件的其他属性。                         |

## 示例用法

```typescript
import TreeSelect from './TreeSelect';

const MyComponent = () => {
  const options = [
    { id: 1, name: '节点 1', subNodes: [{ id: 2, name: '节点 1.1' }] },
  ];

  const handleChange = (value: string | number) => {
    console.log('选择的值:', value);
  };

  return (
    <TreeSelect
      valueKey="id"
      labelKey="name"
      childrenKey="subNodes"
      options={options}
      width="100%"
      placeholder="请选择一个节点"
      onChange={handleChange}
    />
  );
};
```

### 说明

1. **动态键映射**: 该组件允许通过 `valueKey`、`labelKey` 和 `childrenKey` 属性来映射自定义的 `value`、`label` 和 `children` 字段。这在处理不同数据结构时提供了很大的灵活性。
2. **树形数据转换**: `arrTransform` 工具根据提供的配置将平面选项数组转换为树形结构。
3. **Ant Design 集成**: 所有其他属性都直接传递给 Ant Design 的 `TreeSelect` 组件，从而允许完全自定义其行为和外观。

### 依赖项

- **Ant Design 组件**: 使用了 Ant Design 的 `TreeSelect`。
- **`arrTransform` 工具**: 用于将选项数组转换为树形结构。

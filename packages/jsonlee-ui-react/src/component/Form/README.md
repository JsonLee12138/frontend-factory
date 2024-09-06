# Form 组件文档
[English Documentation](https://github.com/JsonLee12138/frontend-factory/blob/main/packages/jsonlee-ui-react/component/Form/README.en.md)

## 概述

`Form` 组件是基于 Ant Design 的 `Form` 构建的一个动态和响应式表单生成器。它支持渲染多种表单字段类型，如文本输入、数字输入、选择框和开关，同时提供了自定义布局、列宽和动态行为的选项。通过 `ref`，可以对表单进行编程控制，包括提交和重置操作。

## 属性

### Form 属性

| 名称                  | 类型                  | 描述                                                                                           |
|-----------------------|-----------------------|------------------------------------------------------------------------------------------------|
| `layout`              | `string`              | 表单布局，可选值为 `horizontal`（水平）、`vertical`（垂直）或 `inline`（内联）。默认值为 `horizontal`。|
| `fieldMinWidth`       | `number`              | 每个表单字段的最小宽度，用于确定网格的跨度。                                                     |
| `gutter`              | `number`              | 表单字段之间的间距，默认为 `16`。                                                              |
| `scrollToFirstError`  | `boolean`             | 是否在提交时滚动到第一个有错误的字段，默认为 `true`。                                           |
| `fields`              | `FormFieldItem[]`     | 表单字段的配置数组。每个配置指定字段的类型、标签、验证规则等。                                     |
| `colon`               | `boolean`             | 是否在标签后添加冒号。                                                                         |
| `labelAlign`          | `string`              | 标签的对齐方式，可选值为 `left` 或 `right`。                                                   |
| `onSubmit`            | `function`            | 当表单提交时的回调函数。                                                                       |
| `...props`            | `object`              | 传递给 Ant Design [`Form`](https://ant.design/components/form-cn#api) 组件的其他属性。           |

### FormFieldItem

`fields` 数组中的每个字段都是一个对象，具有以下属性：

| 名称           | 类型            | 描述                                                                      |
|----------------|-----------------|---------------------------------------------------------------------------|
| `name`         | `string`        | 字段的名称，用作表单中的键。                                                |
| `type`         | `string`        | 字段的类型（如 `text`、`inputNumber`、`select`、`switch`）。                 |
| `label`        | `string`        | 字段的标签。                                                              |
| `rules`        | `array`         | 字段的验证规则。                                                           |
| `inputProps`   | `object`        | 传递给输入组件的其他属性。                                                  |
| `component`    | `function`      | 如果预定义的字段类型不合适，可以通过此属性传递自定义字段组件。               |
| `col`          | `number`        | 字段的列跨度，默认为 `1`。                                                 |
| `uniqueKey`    | `string`        | 字段的唯一键。                                                             |
| `warning`      | `string`        | 可选的警告信息，显示在标签旁边。                                           |

## 方法

`Form` 组件通过 `ref` 暴露以下方法：

1. **submit()**: 以编程方式提交表单。
2. **reset()**: 重置表单字段为初始值。
3. **setFieldsValue(values: object)**: 以编程方式设置特定字段的值。

### 示例用法

```typescript
import { useRef } from 'react';
import Form from './Form';

const MyComponent = () => {
  const formRef = useRef(null);

  const handleSubmit = (values) => {
    console.log('表单提交的数据:', values);
  };

  const fields = [
    { name: 'username', label: '用户名', type: 'text', rules: [{ required: true }] },
    { name: 'age', label: '年龄', type: 'inputNumber', rules: [{ required: true }] },
    { name: 'gender', label: '性别', type: 'select', inputProps: { options: ['男', '女'] } },
  ];

  return (
    <Form
      ref={formRef}
      layout="horizontal"
      fields={fields}
      onSubmit={handleSubmit}
    />
  );
};
```

### 说明

1. **字段组件**: 每个字段类型（文本、数字、选择框、开关）根据 `fields` 数组中提供的字段类型渲染。如果需要自定义组件，可以通过 `component` 属性注入自定义字段。
2. **动态布局**: 布局根据表单的宽度和 `fieldMinWidth` 属性确定。组件根据可用宽度计算每个字段的适当跨度。
3. **响应式行为**: 表单根据当前视口大小动态调整字段宽度，确保布局响应式。
4. **表单方法**: 使用 `useImperativeHandle`，通过 `ref` 暴露 `submit`、`reset` 和 `setFieldsValue` 等方法，供外部控制。

### 依赖项

- **Ant Design 组件**: 使用 Ant Design 的 `Form`、`Input`、`InputNumber`、`Select` 和 `Switch` 组件。
- **`useBoolean` 和 `useSafeState` Hooks**: 用于管理状态，并提供安全的方式处理异步更新。

## 注意事项

- **自定义字段**: 如果预定义的字段类型（文本、数字、选择框、开关）不满足需求，可以通过 `component` 属性传递自定义组件。
- **字段布局**: 表单的列数根据表单的宽度和 `fieldMinWidth` 属性计算，确保字段以网格布局显示。

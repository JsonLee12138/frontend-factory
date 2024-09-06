# Form Component Documentation
[中文文档](https://github.com/JsonLee12138/frontend-factory/blob/main/packages/jsonlee-ui-react/component/Form/README.md)

## Overview

The `Form` component is a dynamic and responsive form generator built on top of Ant Design's `Form`. It allows for the rendering of various form fields such as text inputs, numbers, selects, and switches, while providing options for customized layout, column widths, and dynamic behavior. The form can be controlled via `ref`, allowing for programmatic submission and resetting of the form.

## Props

### Form Props

| Name                  | Type                  | Description                                                                                           |
|-----------------------|-----------------------|-------------------------------------------------------------------------------------------------------|
| `layout`              | `string`              | The form layout. Can be `horizontal`, `vertical`, or `inline`. Defaults to `horizontal`.               |
| `fieldMinWidth`       | `number`              | The minimum width for each form field. Used to determine the span of the grid.                         |
| `gutter`              | `number`              | The spacing between form fields in a row. Defaults to `16`.                                            |
| `scrollToFirstError`  | `boolean`             | Whether to scroll to the first field with an error on submit. Defaults to `true`.                      |
| `fields`              | `FormFieldItem[]`     | An array of field configurations. Each configuration specifies the field type, label, rules, and more. |
| `colon`               | `boolean`             | Whether to add a colon after the label.                                                               |
| `labelAlign`          | `string`              | The alignment of the form labels. Can be `left` or `right`.                                            |
| `onSubmit`            | `function`            | Callback function when the form is submitted.                                                          |
| `...props`            | `object`              | Additional props passed to the underlying Ant Design [`Form`](https://ant.design/components/form-cn#api) component.                                 |

### FormFieldItem

Each field in the `fields` array is an object with the following properties:

| Name           | Type            | Description                                                                 |
|----------------|-----------------|-----------------------------------------------------------------------------|
| `name`         | `string`        | The name of the field, used as a key in the form.                            |
| `type`         | `string`        | The type of the field (e.g., `text`, `inputNumber`, `select`, `switch`).     |
| `label`        | `string`        | The label of the field.                                                     |
| `rules`        | `array`         | Validation rules for the field.                                              |
| `inputProps`   | `object`        | Additional properties to pass to the input component.                        |
| `component`    | `function`      | Custom field component if a predefined type is not suitable.                 |
| `col`          | `number`        | Column span for the field. Defaults to `1`.                                  |
| `uniqueKey`    | `string`        | Unique key for the field.                                                    |
| `warning`      | `string`        | Optional warning message displayed alongside the label.                      |

## Methods

The `Form` component exposes the following methods via `ref`:

1. **submit()**: Submits the form programmatically.
2. **reset()**: Resets the form fields to their initial values.
3. **setFieldsValue(values: object)**: Sets the values of specific fields programmatically.

### Example Usage

```typescript
import { useRef } from 'react';
import Form from './Form';

const MyComponent = () => {
  const formRef = useRef(null);

  const handleSubmit = (values) => {
    console.log('Form submitted:', values);
  };

  const fields = [
    { name: 'username', label: 'Username', type: 'text', rules: [{ required: true }] },
    { name: 'age', label: 'Age', type: 'inputNumber', rules: [{ required: true }] },
    { name: 'gender', label: 'Gender', type: 'select', inputProps: { options: ['Male', 'Female'] } },
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

### Explanation

1. **Field Components**: Each field type (text, number, select, switch) is rendered based on the field type provided in the `fields` array. If a custom component is required, the `component` prop allows for the injection of a custom field.
2. **Dynamic Layout**: The layout is determined by the form's width and the `fieldMinWidth` property. The component calculates the appropriate span for each field based on the available width.
3. **Responsive Behavior**: The form dynamically adjusts field widths based on the current viewport size, ensuring a responsive layout.
4. **Form Methods**: Using `useImperativeHandle`, methods such as `submit`, `reset`, and `setFieldsValue` are exposed via `ref` for external control.

### Dependencies

- **Ant Design Components**: Uses `Form`, `Input`, `InputNumber`, `Select`, and `Switch` from Ant Design.
- **`useBoolean` and `useSafeState` Hooks**: Utilized for managing state and providing a safe way to handle asynchronous updates.

## Notes

- **Custom Fields**: If the predefined field types (text, number, select, switch) are insufficient, you can pass a custom component via the `component` prop.
- **Field Layout**: The number of columns in the form is calculated based on the form's width and the `fieldMinWidth` property. This ensures that fields are displayed in a grid layout.

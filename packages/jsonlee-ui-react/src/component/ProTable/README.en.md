+++
# ProTable Component Documentation
[中文文档](https://github.com/JsonLee12138/frontend-factory/blob/main/packages/jsonlee-ui-react/component/ProTable/README.md)

## Overview

`ProTable` is a highly customizable and feature-rich table component that integrates pagination, search functionality, custom actions, and more. It is designed to handle complex table data efficiently and provides a range of options, including dynamic updates, scroll actions, and custom rendering functions. With the latest updates, `ProTable` now includes a set of sub-components that can be used individually or together, offering even greater flexibility and extensibility.

## Props

| Name               | Type                                          | Description                                                                                  |
|--------------------|-----------------------------------------------|----------------------------------------------------------------------------------------------|
| `columns`          | `ColumnProps[]`                               | The configuration for the table columns.                                                     |
| `dataSource`       | `T[]`                                         | The data source for the table.                                                               |
| `request`          | `function`                                    | Function to fetch data from the server.                                                      |
| `initParams`       | `P`                                           | Initial parameters for data fetching.                                                        |
| `paramsTransform`  | `function`                                    | Function to transform the parameters before making requests.                                 |
| `resultTransform`  | `function`                                    | Function to transform the server response before displaying it in the table.                 |
| `loading`          | `boolean`                                     | Controls the loading state of the table.                                                     |
| `pagination`       | `PaginationProps`                             | Pagination configuration.                                                                    |
| `buttons`          | `ReactNode`                                   | Custom buttons to be rendered at the top of the table.                                        |
| `searchRender`     | `function`                                    | Function to render a search bar with specific fields.                                         |
| `tableRender`      | `function`                                    | Function to render the table body.                                                           |
| `paginationRender` | `function`                                    | Function to render pagination controls.                                                      |
| `...props`         | `object`                                      | Additional properties passed to the underlying Ant Design [`Table`](https://ant.design/components/table-cn#api) component. |

## Methods

The `ProTable` component exposes the following methods via `ref`:

1. **refresh()**: Triggers a refresh of the table data by making a new request.
2. **scrollTo(props: ScrollToProps)**: Programmatically scrolls to a specific part of the table.

## Subcomponents

`ProTable` now includes a set of subcomponents that can be used independently or alongside `ProTable`, making it more modular and customizable. These subcomponents offer enhanced flexibility in building complex table interfaces.

### Subcomponents

| Name          | Description                                                                 |
|---------------|-----------------------------------------------------------------------------|
| `Buttons`     | A component for rendering custom action buttons, typically at the top of the table. |
| `Container`   | A container component that wraps the table and its associated elements.      |
| `Provider`    | Provides context for managing table state and data.                         |
| `Table`       | The main table body component for rendering rows and columns.               |
| `Search`      | A search bar component for filtering table data based on user input.        |
| `Col`         | A column component with support for tooltips and additional customization.  |
| `Title`       | A title component that displays a custom title and optional tooltip.        |
| `Tools`       | A toolbar component for managing top-level table actions and controls.      |

### Example Usage

```typescript
import ProTable from './ProTable';

const MyComponent = () => {
  const tableRef = useRef(null);

  const fetchData = async (params) => {
    // Fetch data based on parameters
  };

  return (
    <ProTable
      ref={tableRef}
      columns={[
        { title: 'Name', dataIndex: 'name' },
        { title: 'Age', dataIndex: 'age' },
      ]}
      request={fetchData}
      pagination={{ pageSize: 10 }}
    />
  );
};

// Using Subcomponents
const AnotherComponent = () => {
  return (
    <ProTable.Container headerRender={<ProTable.Title title={'Custom Title'} />}>
    </ProTable.Container>
  );
};
```

### Explanation

1. **Highly Customizable**: The component allows for flexible configurations, such as custom buttons, search bars, pagination, and now subcomponents, providing even more control over the table's UI and functionality.
2. **Dynamic Updates**: The `refresh` method enables dynamic data updates without needing to reload the entire page.
3. **Scroll Control**: The `scrollTo` method allows for control over scrolling to specific table parts, making it ideal for large datasets.
4. **Subcomponent Extension**: The new subcomponents (`Buttons`, `Search`, `Col`, `Title`, `Tools`, etc.) allow developers to further extend the functionality and appearance of the table.

### Dependencies

- **Ant Design**: Utilizes `Table`, `Pagination`, and related components from Ant Design.
- **Custom Hooks**: Implements React hooks like `useMemo`, `useRef`, and `useImperativeHandle` for performance optimizations and ref forwarding.
+++

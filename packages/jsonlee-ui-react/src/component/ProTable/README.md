# ProTable 组件文档
[English Document](https://github.com/JsonLee12138/frontend-factory/blob/main/packages/jsonlee-ui-react/component/ProTable/README.en.md)

## 概述

`ProTable` 是一个功能强大且高度可定制的表格组件，集成了分页、搜索功能和自定义操作。它旨在高效处理复杂的表格数据，允许动态更新、滚动操作以及自定义渲染函数。通过新增的功能，`ProTable` 现在可以作为一个包含多个子组件的集合使用，进一步提升了其灵活性和可扩展性。

## 属性

| 名称               | 类型                                          | 描述                                                                                      |
|--------------------|-----------------------------------------------|------------------------------------------------------------------------------------------|
| `columns`          | `ColumnProps[]`                               | 表格的列配置。                                                                            |
| `dataSource`       | `T[]`                                         | 表格的数据源。                                                                            |
| `request`          | `function`                                    | 用于从服务器获取数据的函数。                                                              |
| `initParams`       | `P`                                           | 数据获取的初始参数。                                                                      |
| `paramsTransform`  | `function`                                    | 用于在发送请求之前转换参数的函数。                                                        |
| `resultTransform`  | `function`                                    | 用于在显示到表格之前转换响应数据的函数。                                                  |
| `loading`          | `boolean`                                     | 表格的加载状态。                                                                          |
| `pagination`       | `PaginationProps`                             | 分页设置。                                                                               |
| `buttons`          | `ReactNode`                                   | 在表格顶部渲染的自定义按钮。                                                              |
| `searchRender`     | `function`                                    | 用于渲染带有特定字段的搜索栏的函数。                                                      |
| `tableRender`      | `function`                                    | 用于渲染表格本身的函数。                                                                  |
| `paginationRender` | `function`                                    | 用于渲染分页控件的函数。                                                                  |
| `...props`         | `object`                                      | 传递给底层 Ant Design [`Table`](https://ant.design/components/table-cn#api) 组件的其他属性。|

## 方法

`ProTable` 组件通过 `ref` 提供以下两个方法：

1. **refresh()**: 通过重新触发请求刷新表格数据。
2. **scrollTo(props: ScrollToProps)**: 以编程方式滚动到表格的特定部分。

## 子组件

`ProTable` 现在提供了一组子组件，这些组件可以单独使用，或与 `ProTable` 一起使用，以进一步增强其功能。这些子组件可以灵活组合，以满足各种复杂的 UI 需求。

### 子组件

| 名称          | 说明                                                                |
|---------------|---------------------------------------------------------------------|
| `Buttons`     | 自定义操作按钮的组件，通常用于表格的顶部操作区。                       |
| `Container`   | 表格容器组件，用于包含表格的整体布局和操作区域。                       |
| `Provider`    | 提供上下文用于管理表格的状态和数据。                                  |
| `Table`       | 表格主体组件，用于渲染实际的表格内容。                                 |
| `Search`      | 搜索组件，提供表格上方的搜索栏，用于按条件过滤数据。                   |
| `Col`         | 表格列组件，支持带有工具提示的列渲染。                                |
| `Title`       | 表格标题组件，支持自定义标题和提示信息的显示。                         |
| `Tools`       | 工具栏组件，用于管理表格顶部的工具按钮和操作。                         |

### 示例用法

```typescript
import ProTable from './ProTable';

const MyComponent = () => {
  const tableRef = useRef(null);

  const fetchData = async (params) => {
    // 根据参数获取数据
  };

  return (
    <ProTable
      ref={tableRef}
      columns={[
        { title: '姓名', dataIndex: 'name' },
        { title: '年龄', dataIndex: 'age' },
      ]}
      request={fetchData}
      pagination={{ pageSize: 10 }}
    />
  );
};

// 使用子组件
const AnotherComponent = () => {
  return (
    <ProTable.Container headerRender={<ProTable.Title title={'自定义标题'} />}>
    </ProTable.Container>
  );
};
```

### 说明

1. **高度可定制**: 该组件允许高度灵活的配置，例如自定义按钮、搜索栏和分页。通过子组件的加入，可以在表格的各个部分添加自定义操作和内容。
2. **动态更新**: 通过 `refresh` 方法，可以动态重新获取数据而无需刷新整个页面。
3. **滚动控制**: `scrollTo` 方法允许控制表格的特定部分，适用于处理大数据集。
4. **子组件扩展**: 新增的子组件（如 `Buttons`, `Search`, `Col`, `Title`, `Tools` 等）允许开发者进一步扩展表格的功能和界面。

### 依赖

- **Ant Design**: 使用了 `Table`、`Pagination` 等相关组件。
- **自定义钩子**: 使用了 `useMemo`、`useRef` 和 `useImperativeHandle` 等 React 钩子进行优化和 ref 转发。

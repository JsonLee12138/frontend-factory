# IconPark 组件文档
[English Document](https://github.com/JsonLee12138/frontend-factory/blob/main/packages/jsonlee-ui-react/component/IconPark/README.en.md)

## 概述

`IconPark` 组件是对 Icon Park 库的封装，支持动态加载和主题配置。它允许按需加载图标，并支持通过编程方式控制图标的加载过程。组件使用 `@icon-park/react` 包渲染各种图标，并在找不到图标时接受其他子内容作为后备。

## 属性

| 名称         | 类型                            | 描述                                                                       |
|--------------|---------------------------------|----------------------------------------------------------------------------|
| `name`       | `string`                        | 图标名称，可以使用 `iconName/theme` 的格式指定主题。                         |
| `theme`      | `IconParkProps['theme']`        | 图标的主题（如 `outline`、`filled`、`two-tone` 等）。                         |
| `cusLoad`    | `boolean`                       | 控制图标是否按需加载。                                                      |
| `className`  | `string`                        | 图标外部容器的可选 CSS 类名。                                                |
| `style`      | `React.CSSProperties`           | 图标外部容器的可选内联样式。                                                |
| `children`   | `ReactNode`                     | 如果未找到图标，则渲染子内容作为后备内容。                                   |
| `...props`   | `IconParkProps`                 | 传递给底层 [`Icon Park`](https://www.npmjs.com/package/@icon-park/react) 组件的其他属性。                                         |

## 方法

`IconPark` 组件通过 `ref` 暴露了一个 `load()` 方法，该方法可以用于以编程方式触发图标加载。

### 示例用法

```typescript
import { useRef } from 'react';
import IconPark from './IconPark';

const MyComponent = () => {
  const iconRef = useRef(null);

  const handleClick = () => {
    if (iconRef.current) {
      iconRef.current.load(); // 以编程方式触发图标加载
    }
  };

  return (
    <div>
      <button onClick={handleClick}>加载图标</button>
      <IconPark ref={iconRef} name="home" theme="outline" />
    </div>
  );
};
```

### 说明

1. **按需加载**: 如果 `cusLoad` 设置为 `true`，图标不会自动加载，直到通过编程方式调用 `load()` 方法。
2. **动态主题**: `name` 属性可以包括图标名称和主题，通过 `/` 分隔。例如，`home/filled` 将加载 `home` 图标并应用 `filled` 主题。
3. **后备内容**: 如果在图标库中找不到指定的图标，将渲染 `children` 作为后备内容。
4. **状态管理**: 组件使用 `ahooks` 的 `useBoolean` 和 `useSafeState` 钩子管理加载状态，并安全地更新 `name` 和 `theme`。

### 依赖项

- **@icon-park/react**: 用于渲染图标。
- **`ahooks` 的 `useBoolean` 和 `useSafeState` 钩子**: 用于内部状态管理并确保安全更新。
+++

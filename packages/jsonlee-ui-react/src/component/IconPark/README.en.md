# IconPark Component Documentation
[中文文档](https://github.com/JsonLee12138/frontend-factory/blob/main/packages/jsonlee-ui-react/component/IconPark/README.md)

## Overview

The `IconPark` component is a wrapper around the Icon Park library, allowing dynamic loading and theming of icons. It supports lazy loading of icons if needed and enables programmatic control over the icon loading process. The component uses the `@icon-park/react` package to render various icons and can accept additional children as fallback content when the icon isn't found.

## Props

| Name         | Type                            | Description                                                                 |
|--------------|---------------------------------|-----------------------------------------------------------------------------|
| `name`       | `string`                        | The name of the icon, with optional theme specified as `iconName/theme`.     |
| `theme`      | `IconParkProps['theme']`        | The theme for the icon (e.g., `outline`, `filled`, `two-tone`, etc.).        |
| `cusLoad`    | `boolean`                       | Controls whether the icon should be loaded lazily.                           |
| `className`  | `string`                        | Optional CSS class for the icon wrapper.                                     |
| `style`      | `React.CSSProperties`           | Optional inline styles for the icon wrapper.                                 |
| `children`   | `ReactNode`                     | Fallback content if the icon is not found.                                   |
| `...props`   | `IconParkProps`                 | Additional properties passed to the underlying [`Icon Park`](https://www.npmjs.com/package/@icon-park/react) component.          |

## Methods

The `IconPark` component exposes a `load()` method via `ref`, which can be used to trigger the icon loading process programmatically.

### Example Usage

```typescript
import { useRef } from 'react';
import IconPark from './IconPark';

const MyComponent = () => {
  const iconRef = useRef(null);

  const handleClick = () => {
    if (iconRef.current) {
      iconRef.current.load(); // Programmatically trigger icon load
    }
  };

  return (
    <div>
      <button onClick={handleClick}>Load Icon</button>
      <IconPark ref={iconRef} name="home" theme="outline" />
    </div>
  );
};
```

### Explanation

1. **Lazy Loading**: If `cusLoad` is set to `true`, the icon will not load until the `load()` method is called programmatically.
2. **Dynamic Theming**: The `name` prop can include both the icon name and its theme, separated by a `/`. For example, `home/filled` will load the `home` icon with the `filled` theme.
3. **Fallback Content**: If the icon isn't found in the icon park library, the `children` will be rendered as a fallback.
4. **State Management**: The component uses `ahooks` for state management (`useBoolean` for loading state and `useSafeState` for safely updating `name` and `theme`).

### Dependencies

- **@icon-park/react**: For rendering icons.
- **`useBoolean` and `useSafeState` Hooks from `ahooks`**: For managing internal state and ensuring safe updates.

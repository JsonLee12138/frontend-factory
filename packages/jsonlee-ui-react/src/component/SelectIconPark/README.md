# SelectIconPark 组件文档
[English Document](https://github.com/JsonLee12138/frontend-factory/blob/main/packages/jsonlee-ui-react/component/SelectIconPark/README.en.md)

## 概述

`SelectIconPark` 组件是一个基于 Ant Design 和 Icon Park 的对话框图标选择器。用户可以通过一个可搜索的对话框从 Icon Park 图标库中选择图标。该组件支持通过 `ref` 进行外部控制，可以以编程方式打开或关闭对话框。

## 属性

| 名称            | 类型                 | 描述                                                                                      |
|-----------------|----------------------|------------------------------------------------------------------------------------------|
| `onChange`      | `function`            | 当选择图标时触发的回调函数，选择的图标键作为参数传递。                                       |
| `value`         | `string`              | 组件中当前选择的值（图标键）。                                                             |
| `title`         | `string`              | 对话框的标题，默认为 `图标库`。                                                            |
| `showSearch`    | `boolean`             | 控制对话框中是否显示搜索框，默认为 `true`。                                               |
| `placeholder`   | `string`              | 搜索输入框的占位符，默认为 `请输入图标关键字`。                                             |
| `...props`      | `object`              | 传递给底层 [`Dialog`](https://github.com/JsonLee12138/frontend-factory/blob/main/packages/jsonlee-ui-react/component/Dialog/README.md) 组件的其他属性。                                                       |

## 方法

`SelectIconPark` 组件通过 `ref` 暴露两个方法：

1. **open()**: 以编程方式打开对话框。
2. **close()**: 以编程方式关闭对话框。

### 示例用法

```typescript
import { useRef, useState } from 'react';
import SelectIconPark from './SelectIconPark';

const MyComponent = () => {
  const iconSelectorRef = useRef(null);
  const [selectedIcon, setSelectedIcon] = useState<string>('');

  const handleIconChange = (icon: string) => {
    setSelectedIcon(icon);
  };

  return (
    <>
      <button onClick={() => iconSelectorRef.current.open()}>选择图标</button>
      <SelectIconPark
        ref={iconSelectorRef}
        value={selectedIcon}
        onChange={handleIconChange}
        title="选择一个图标"
        placeholder="搜索图标"
      />
      {selectedIcon && <p>已选择图标: {selectedIcon}</p>}
    </>
  );
};
```

### 说明

1. **对话框控制**: `open()` 和 `close()` 方法允许外部以编程方式控制对话框的显示，方便触发图标选择过程。
2. **搜索功能**: 搜索输入框允许用户通过输入图标名称的一部分来过滤图标，搜索时不区分大小写。
3. **图标选择**: 当用户选择图标时，会触发 `onChange` 回调，并将选择的图标键作为参数传递。
4. **自定义**: 可以通过 `title` 和 `placeholder` 属性来自定义对话框的外观和功能。

### 依赖项

- **Ant Design 组件**: 使用了 Ant Design 的 `Dialog`、`Input.Search` 组件。
- **Icon Park**: 该组件依赖于 Icon Park 的 `ALL_ICON_KEYS` 数组进行图标选择。
- **`ahooks` 的 `useSafeState`**: 用于安全管理状态更新。

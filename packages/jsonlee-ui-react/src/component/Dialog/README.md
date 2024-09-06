# Dialog 组件文档
[English Document](https://github.com/JsonLee12138/frontend-factory/blob/main/packages/jsonlee-ui-react/component/Dialog/README.en.md)

## 概述

`Dialog` 组件是对 Ant Design 中 `Modal` 组件的封装，提供了便捷的接口以编程方式管理对话框。该组件支持动态标题更新、确认操作的回调钩子以及自定义对话框行为。

## Props

### Dialog Props

| 名称         | 类型           | 描述                                                                                    |
|--------------|----------------|-----------------------------------------------------------------------------------------|
| `title`      | `string`       | 对话框的标题。可以在打开时动态更新。                                                     |
| `onConfirm`  | `function`     | 当点击 "OK" 按钮时触发的回调函数，接收 `close` 函数作为参数。                             |
| `afterClose` | `function`     | 对话框关闭后执行的回调函数。                                                             |
| `children`   | `ReactNode`    | 对话框中的内容。                                                                         |
| `...props`   | `object`       | 传递给底层 Ant Design [`Modal`](https://ant.design/components/modal-cn#api) 组件的其他属性。                                           |

## 方法

`Dialog` 组件通过 `ref` 暴露以下两个方法：

1. **open(title?: string)**: 打开对话框。可选地接受一个标题字符串来更新对话框标题。
2. **close()**: 关闭对话框。

### 示例用法

```typescript
import { useRef } from 'react';
import Dialog from './Dialog';

const MyComponent = () => {
  const dialogRef = useRef(null);

  const handleConfirm = (close) => {
    // 在确认时执行某些操作
    close(); // 关闭对话框
  };

  return (
    <>
      <button onClick={() => dialogRef.current.open('新标题')}>
        打开对话框
      </button>
      <Dialog
        ref={dialogRef}
        title="默认标题"
        onConfirm={handleConfirm}
        afterClose={() => console.log('对话框已关闭')}
      >
        <p>对话框内容</p>
      </Dialog>
    </>
  );
};
```

### 说明

1. **`useBoolean`**: 该钩子用于管理对话框的可见状态（`true` 表示显示，`false` 表示隐藏）。
2. **`useSafeState`**: 该钩子安全地管理对话框的标题，确保标题可以更新而不会出现竞态条件。
3. **`useImperativeHandle`**: 该钩子用于通过 `ref` 暴露 `open` 和 `close` 方法，以供外部使用。
4. **`open(title?: string)`**: 打开对话框，并可选地更新标题。
5. **`close()`**: 关闭对话框。

### 依赖
- **Ant Design `Modal`**: 提供底层的对话框功能。
- **`ahooks` 中的 `useBoolean` 和 `useSafeState`**: 用于高效地管理状态。

## 注意事项

- **自定义**: 你可以传递任何 Ant Design `Modal` 支持的属性，进一步自定义对话框的行为，如大小、底部按钮等。
- **动态标题**: 当打开对话框时，可以通过 `open` 方法传递新的标题字符串，动态更新标题。

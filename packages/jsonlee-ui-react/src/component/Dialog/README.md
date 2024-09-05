## Dialog 组件文档

### 介绍

`Dialog` 是一个基于 [Ant Design Modal](https://ant.design/components/modal/) 的通用对话框组件，支持动态设置标题、确认操作和关闭回调等功能。通过 `ref` 可以控制对话框的打开和关闭。

### 使用方法

```jsx
import Dialog from './Dialog';
import { useRef } from 'react';

const MyComponent = () => {
  const dialogRef = useRef(null);

  const handleConfirm = (close) => {
    console.log('确认操作');
    close(); // 关闭对话框
  };

  const openDialog = () => {
    dialogRef.current?.open('自定义标题');
  };

  return (
    <>
      <button onClick={openDialog}>打开对话框</button>
      <Dialog ref={dialogRef} onConfirm={handleConfirm}>
        这里是对话框内容
      </Dialog>
    </>
  );
};
```

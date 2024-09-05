## SelectIconPark 组件文档

### 介绍

`SelectIconPark` 是一个用于选择 [IconPark](https://iconpark.oceanengine.com/home) 图标的组件，支持搜索功能，并使用了 `Dialog` 组件进行图标选择的弹窗展示。

### 使用方法

```jsx
import SelectIconPark from './SelectIconPark';
import { useRef } from 'react';

const MyComponent = () => {
  const selectIconRef = useRef(null);

  const handleChange = (iconName) => {
    console.log('选中的图标:', iconName);
  };

  const openIconSelector = () => {
    selectIconRef.current?.open();
  };

  return (
    <>
      <button onClick={openIconSelector}>选择图标</button>
      <SelectIconPark ref={selectIconRef} onChange={handleChange} />
    </>
  );
};
```

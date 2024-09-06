# SelectIconPark Component Documentation
[中文文档](https://github.com/JsonLee12138/frontend-factory/blob/main/packages/jsonlee-ui-react/component/SelectIconPark/README.md)

## Overview

The `SelectIconPark` component is a dialog-based icon selector built on top of Ant Design and Icon Park. It allows users to select an icon from the Icon Park library through a searchable dialog. The component also supports external control via `ref` to programmatically open or close the dialog.

## Props

| Name            | Type                 | Description                                                                                      |
|-----------------|----------------------|--------------------------------------------------------------------------------------------------|
| `onChange`      | `function`            | Callback function triggered when an icon is selected. The selected icon key is passed as an argument.|
| `value`         | `string`              | The current value (icon key) selected in the component.                                           |
| `title`         | `string`              | The title of the dialog. Defaults to `Icon Library`.                                              |
| `showSearch`    | `boolean`             | Controls whether the search bar is shown in the dialog. Defaults to `true`.                       |
| `placeholder`   | `string`              | The placeholder text for the search input. Defaults to `Enter icon keyword`.                      |
| `...props`      | `object`              | Additional props passed to the underlying [`Dialog`](https://github.com/JsonLee12138/frontend-factory/blob/main/packages/jsonlee-ui-react/component/Dialog/README.en.md) component.                                     |

## Methods

The `SelectIconPark` component exposes two methods via `ref`:

1. **open()**: Opens the dialog programmatically.
2. **close()**: Closes the dialog programmatically.

### Example Usage

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
      <button onClick={() => iconSelectorRef.current.open()}>Select Icon</button>
      <SelectIconPark
        ref={iconSelectorRef}
        value={selectedIcon}
        onChange={handleIconChange}
        title="Choose an Icon"
        placeholder="Search for an icon"
      />
      {selectedIcon && <p>Selected Icon: {selectedIcon}</p>}
    </>
  );
};
```

### Explanation

1. **Dialog Control**: The `open()` and `close()` methods allow external control over the dialog visibility, which is useful for triggering the icon selection process programmatically.
2. **Search Functionality**: The search input enables users to filter the icons by typing part of the icon name. The search is case-insensitive.
3. **Icon Selection**: When a user selects an icon, the `onChange` callback is triggered, and the selected icon key is passed as an argument.
4. **Customization**: The `title` and `placeholder` props allow for customizing the dialog's appearance and functionality.

### Dependencies

- **Ant Design Components**: Uses `Dialog`, `Input.Search` from Ant Design.
- **Icon Park**: The component relies on the `ALL_ICON_KEYS` array from Icon Park for icon selection.
- **`useSafeState` from `ahooks`**: For managing state updates safely.

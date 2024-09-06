# Dialog Component Documentation
[中文文档](https://github.com/JsonLee12138/frontend-factory/blob/main/packages/jsonlee-ui-react/component/Dialog/README.md)

## Overview

The `Dialog` component is a wrapper around the `Modal` component from Ant Design. It provides an easy-to-use interface for managing dialogs with functions to open and close them programmatically. The component supports dynamic title updates, hooks for confirmation actions, and customizable dialog behavior.

## Props

### Dialog Props

| Name       | Type             | Description                                                                                  |
|------------|------------------|----------------------------------------------------------------------------------------------|
| `title`    | `string`         | The title of the dialog. Can be updated when opened programmatically.                         |
| `onConfirm`| `function`       | A callback function that is triggered when the "OK" button is clicked. It receives the `close` function. |
| `afterClose`| `function`      | A callback that is executed after the dialog is closed.                                       |
| `children` | `ReactNode`      | The content inside the dialog.                                                               |
| `...props` | `object`         | Additional props passed to the underlying Ant Design [`Modal`](https://ant.design/components/modal-cn#api) component.                      |

## Methods

The `Dialog` component exposes two methods via `ref`:

1. **open(title?: string)**: Opens the dialog. Optionally accepts a title string to update the dialog title.
2. **close()**: Closes the dialog.

### Example Usage

```typescript
import { useRef } from 'react';
import Dialog from './Dialog';

const MyComponent = () => {
  const dialogRef = useRef(null);

  const handleConfirm = (close) => {
    // Perform some actions on confirmation
    close(); // Close the dialog
  };

  return (
    <>
      <button onClick={() => dialogRef.current.open('New Title')}>
        Open Dialog
      </button>
      <Dialog
        ref={dialogRef}
        title="Default Title"
        onConfirm={handleConfirm}
        afterClose={() => console.log('Dialog closed')}
      >
        <p>Dialog content goes here.</p>
      </Dialog>
    </>
  );
};
```

### Explanation

1. **`useBoolean`**: This hook is used to manage the visibility state of the dialog (`true` to show, `false` to hide).
2. **`useSafeState`**: This hook safely manages the dialog title, ensuring that the title can be updated without risking race conditions.
3. **`useImperativeHandle`**: This is used to expose the `open` and `close` methods for external usage via a `ref`.
4. **`open(title?: string)`**: Opens the dialog and optionally updates the title.
5. **`close()`**: Closes the dialog.

### Dependencies
- **Ant Design `Modal`**: Provides the underlying modal functionality.
- **`useBoolean`, `useSafeState` from `ahooks`**: Used to manage state efficiently.

## Notes

- **Customization**: You can pass any props that the Ant Design `Modal` accepts, allowing for further customization such as size, footer actions, etc.
- **Dynamic Titles**: Titles can be dynamically updated when opening the dialog by passing a new title string to the `open` method.

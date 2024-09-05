import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { ALL_ICON_KEYS } from '@icon-park/react/es/all';
import type {
  SelectIconInstance,
  SelectIconParkProps,
} from '@/types/selectIconPark';
import Dialog from '../Dialog';
import { useSafeState } from 'ahooks';
import type { DialogInstance } from '@/types/dialog';
import IconsBar from './IconsBar';
import { Input } from 'antd';

const { Search } = Input;

const SelectIconPark = forwardRef<SelectIconInstance, SelectIconParkProps>(
  (
    {
      onChange,
      value: _value,
      title = '图标库',
      showSearch = true,
      placeholder = '请输入图标关键字',
      ...props
    },
    ref,
  ) => {
    const dialogRef = useRef<DialogInstance>(null);
    const [options, setOptions] = useSafeState<string[]>(ALL_ICON_KEYS);

    const handleOpen = useCallback(() => {
      dialogRef.current?.open();
    }, [dialogRef]);
    const handleClose = useCallback(() => {
      dialogRef.current?.close();
    }, [dialogRef]);

    const handleSelect = useCallback(
      (key: string) => {
        onChange?.(key);
        handleClose();
      },
      [handleClose],
    );

    const handleSearch = useCallback((value: string) => {
      setOptions(ALL_ICON_KEYS.filter((item) => item.toLocaleLowerCase().includes(value.toLocaleLowerCase())));
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        open: handleOpen,
        close: handleClose,
      }),
      [handleOpen, handleClose],
    );

    return (
      <Dialog
        {...props}
        footer={null}
        ref={dialogRef}
        title={
          <div className={'flex items-center'}>
            <span className={'mr-3'}>{title}</span>
            {showSearch && (
              <Search
                className={'max-w-[240px]'}
                placeholder={placeholder}
                onSearch={handleSearch}
                enterButton
                allowClear
              />
            )}
          </div>
        }
      >
        <IconsBar options={options} onSelect={handleSelect} />
      </Dialog>
    );
  },
);

export default SelectIconPark;

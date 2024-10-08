import { forwardRef, useCallback, useImperativeHandle } from 'react';
import { Modal } from 'antd';
import { useBoolean, useSafeState } from 'ahooks';
import { DialogProps } from '@/types/dialog';

const Dialog = forwardRef(
  (
    { title: _title, onConfirm, afterClose, children, ...props }: DialogProps,
    ref,
  ) => {
    const [visible, { setFalse: setVisibleFalse, setTrue: setVisibleTrue }] =
      useBoolean(false);
    const [title, setTitle] = useSafeState<string>(_title as string);
    const [tempData, setTempData] = useSafeState<any>();
    const handleAfterClose = useCallback(() => {
      afterClose?.();
    }, [afterClose]);
    const close = useCallback(() => {
      setVisibleFalse();
    }, []);
    const handleConfirm = useCallback(() => {
      onConfirm?.(close, tempData);
    }, [close, onConfirm]);
    const open = useCallback((title?: string, data?: any) => {
      title && setTitle(title);
      setTempData(data);
      setVisibleTrue();
    }, []);
    useImperativeHandle(
      ref,
      () => ({
        open,
        close,
      }),
      [close, open],
    );
    return (
      <Modal
        {...props}
        title={title}
        className={'json-dialog'}
        open={visible}
        onCancel={close}
        onOk={handleConfirm}
        afterClose={handleAfterClose}
      >
        {children}
      </Modal>
    );
  },
);

export default Dialog;

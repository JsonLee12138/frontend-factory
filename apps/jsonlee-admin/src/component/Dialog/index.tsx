import { forwardRef, ReactNode, useCallback, useImperativeHandle } from 'react';
import { Modal, type ModalProps } from 'antd';
import { useBoolean, useSafeState } from 'ahooks';

interface Props extends Omit<ModalProps, 'open' | 'onOk'> {
  onConfirm?: (done: () => void) => void;
  afterClose?: () => void;
  children?: ReactNode;
}

const Dialog = forwardRef(
  (
    { title: _title, onConfirm, afterClose, children, ...props }: Props,
    ref,
  ) => {
    const [visible, { setFalse: setVisibleFalse, setTrue: setVisibleTrue }] =
      useBoolean(false);
    const [title, setTitle] = useSafeState<string>(_title as string);
    const handleAfterClose = useCallback(() => {
      afterClose?.();
    }, [afterClose]);
    const close = useCallback(() => {
      setVisibleFalse();
    }, []);
    const handleConfirm = useCallback(() => {
      onConfirm?.(close);
    }, [close]);
    const open = useCallback((title?: string) => {
      title && setTitle(title);
      setVisibleTrue();
    }, []);
    useImperativeHandle(
      ref,
      () => ({
        open,
        close,
      }),
      [],
    );
    return (
      <Modal
        {...props}
        title={title}
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

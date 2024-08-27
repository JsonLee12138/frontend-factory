import { forwardRef, ReactNode, useCallback, useImperativeHandle } from 'react';
import { Modal, type ModalProps } from 'antd';
import { useBoolean, useSafeState } from 'ahooks';

interface Props extends Omit<ModalProps, 'open'> {
  onConfirm?: (done: () => void) => void;
  afterClose?: () => void;
  children?: ReactNode;
}

const Dialog = forwardRef(
  ({ onConfirm, afterClose, children, onOk, ...props }: Props, ref) => {
    const [visible, { setFalse: setVisibleFalse, setTrue: setVisibleTrue }] =
      useBoolean(false);
    const [title] = useSafeState<string>('');
    const handleAfterClose = useCallback(() => {
      afterClose?.();
    }, [afterClose]);
    const close = useCallback(() => {
      setVisibleFalse();
    }, []);
    const handleConfirm = useCallback(() => {
      onConfirm?.(close);
    }, [close]);
    const open = useCallback(() => {
      setVisibleTrue();
    }, []);
    useImperativeHandle(ref ,()=> ({
      open,
      close
    }), [])
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

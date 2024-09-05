import { ModalProps } from 'antd';
import { ReactNode } from 'react';

export interface DialogInstance {
  open: (title?: string) => void;
  close: () => void;
}

export interface DialogProps extends Omit<ModalProps, 'open' | 'onOk'> {
  onConfirm?: (done: () => void) => void;
  afterClose?: () => void;
  children?: ReactNode;
}

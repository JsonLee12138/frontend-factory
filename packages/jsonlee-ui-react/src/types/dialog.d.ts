import { ModalProps } from 'antd';
import { ReactNode } from 'react';

export interface DialogInstance {
  open: (title?: string, data?: any) => void;
  close: () => void;
}

export type DialogOnConfirm = (done: () => void, data?: any) => void;

export interface DialogProps extends Omit<ModalProps, 'open' | 'onOk'> {
  onConfirm?: DialogOnConfirm;
  afterClose?: () => void;
  children?: ReactNode;
}

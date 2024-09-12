import { FormProps } from '../Form/type';
import type { AnyObject } from './global';

export type DialogFormProps<T = AnyObject> = Omit<FormProps, 'onSubmit'> & {
  onSubmit?: (values: T, close: () => void) => void;
  afterClose?: () => void;
};

export interface DialogFormInstance<T = AnyObject> {
  open: (_title: string, data?: T) => void;
  close: () => void;
}

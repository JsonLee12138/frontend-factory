import { Component, createRef, forwardRef, useCallback, useRef } from 'react';
import {
  Button,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Modal,
  Switch,
  Table,
} from 'antd';
import Icon from '@icon-park/react/es/all';
// import { forwardRef } from '@/decorator/forwardRef.tsx';
import { autoBind } from 'jsonlee-decorator/src';
import { Menu } from '@/types/api_modules/menu.ts';
import Dialog from '@/component/Dialog';
import type { DialogInstance } from '../Dialog/type';
import { useSafeState } from 'ahooks';

interface Props {
  onConfirm?: (values: any, done: () => void) => void;
  beforeClose?: (done: () => void) => void;
}

interface State<T = any> {
  title: string;
  tempData?: T;
}

const DialogForm = forwardRef(({ onConfirm }: Props, ref) => {
  const dialogRef = useRef<DialogInstance>(null);
  const [form] = Form.useForm();
  const [title, setTitle] = useSafeState<string>('');
  const [tempData, setTempData] = useSafeState<any>();
  const open = useCallback(
    (_title: string, data: any) => {
      setTitle(_title);
      setTempData(data);
      dialogRef.current?.open();
    },
    [dialogRef],
  );
  const close = useCallback(() => {
    dialogRef.current?.close();
  }, [dialogRef]);
  const handleConfirm = useCallback(async () => {
    const valid = await form.validateFields();
    if (valid) {
      if (onConfirm) {
        const formValues = form.getFieldsValue();
        const data = tempData
          ? { ...(tempData as unknown as Menu.UpdateDTO), ...formValues }
          : formValues;
        onConfirm(data, close);
        return;
      }
      close();
    }
  }, [tempData, form, onConfirm, close]);
  const handleAfterClose = useCallback(() => {
    form.resetFields();
  }, [form]);
  return (
    <Dialog
      ref={dialogRef}
      onConfirm={handleConfirm}
      afterClose={handleAfterClose}
    >
      <Form form={form}></Form>
    </Dialog>
  );
});

export default DialogForm;

import {
  forwardRef,
  ReactNode,
  Ref,
  RefAttributes,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import Dialog from '@/component/Dialog';
import type { DialogInstance } from '../Dialog/type';
import { useSafeState } from 'ahooks';
import Form from '@/component/Form';
import {
  DialogFormInstance,
  DialogFormProps,
} from '@/component/DialogForm/type';
import { FormInstance } from '../Form/type';
import { AnyObject } from 'antd/es/_util/type';

const DialogForm = forwardRef(
  <T = AnyObject,>(
    { onSubmit, afterClose, fields, initialValues, title }: DialogFormProps<T>,
    ref: Ref<DialogFormInstance<T>>,
  ) => {
    const dialogRef = useRef<DialogInstance>(null);
    const formRef = useRef<FormInstance>(null);
    const [tempData, setTempData] = useSafeState<Partial<T>>();
    const handleOpen = useCallback(
      (_title: string, data?: Partial<T>) => {
        setTempData(data);
        requestAnimationFrame(() => {
          formRef.current?.setFieldsValue(data || {});
        });
        dialogRef.current?.open(_title);
      },
      [setTempData],
    );
    const close = useCallback(() => {
      dialogRef.current?.close();
    }, [dialogRef]);
    const handleConfirm = useCallback(async () => {
      formRef.current?.submit();
    }, []);
    const handleSubmit = useCallback(
      (values: T) => {
        if (onSubmit) {
          const res: object = {};
          if (tempData) {
            Object.assign(res, tempData);
          }
          Object.assign(res, values);
          onSubmit(res as T, close);
          return;
        }
        close();
      },
      [close, onSubmit, tempData],
    );
    const handleAfterClose = useCallback(() => {
      formRef.current?.reset();
      afterClose?.();
    }, [afterClose]);
    useImperativeHandle(
      ref,
      () => ({
        open: handleOpen,
        close,
      }),
      [close, handleOpen],
    );
    return (
      <Dialog
        ref={dialogRef}
        title={title}
        onConfirm={handleConfirm}
        afterClose={handleAfterClose}
      >
        <Form
          ref={formRef}
          initialValues={initialValues}
          fields={fields}
          onSubmit={handleSubmit}
        />
      </Dialog>
    );
  },
) as unknown as <T = AnyObject>(
  props: DialogFormProps<T> & RefAttributes<DialogFormInstance<T>>,
) => ReactNode;

export default DialogForm;

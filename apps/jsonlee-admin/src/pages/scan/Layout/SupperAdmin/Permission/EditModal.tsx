import DialogForm from '@/component/DialogForm';
import { DialogFormInstance } from '@/component/DialogForm/type';
import {
  PermissionCreateDTO,
  PermissionItem,
  PermissionUpdateDTO,
} from '@/types/api_modules/permission';
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { EditModalRef } from './types';
import { PermissionApi } from '@/api/modules/permission';
import { FormProps } from 'jsonlee-ui-react/dist/types/form';
import { message } from 'antd';

const formFields = [
  {
    label: '权限字符',
    name: 'name',
    inputProps: {
      placeholder: '请输入权限字符',
    },
    rules: [{ required: true, message: '请输入权限字符' }],
  },
  {
    label: '描述',
    warning: '中文名称',
    name: 'desc',
    inputProps: {
      placeholder: '请输入描述(中文名称)',
    },
  },
  {
    label: '分组',
    name: 'group',
    warning: '用户搜索使用',
    inputProps: {
      placeholder: '请输入分组',
    },
  },
];

export interface Props {
  onSubmited?: () => void;
}

const permissionApi = new PermissionApi();

const EditModal = forwardRef<EditModalRef, Props>(({ onSubmited }, ref) => {
  const dialogRef = useRef<DialogFormInstance<PermissionItem>>(null);
  const [msgApi] = message.useMessage();

  const handleOpen = useCallback<EditModalRef['open']>((title, record) => {
    dialogRef.current?.open?.(title, record);
  }, []);

  const handleSubmit = useCallback<Exclude<FormProps['onSubmit'], undefined>>(
    async (values: PermissionItem) => {
      let fn:
        | typeof permissionApi.add<PermissionCreateDTO>
        | typeof permissionApi.update<PermissionUpdateDTO> =
        permissionApi.add<PermissionCreateDTO>;
      if (typeof values.id !== 'undefined') {
        fn = permissionApi.update<PermissionUpdateDTO>;
      }
      try {
        const { msg } = await fn(values);
        msgApi.success(msg);
        onSubmited?.();
      } catch {
        //
      } finally {
        dialogRef.current?.close?.();
      }
    },
    [msgApi, onSubmited],
  );

  useImperativeHandle(
    ref,
    () => ({
      open: handleOpen,
      close: dialogRef.current?.close as () => void,
    }),
    [handleOpen],
  );
  return (
    <DialogForm<PermissionItem>
      ref={dialogRef}
      fields={formFields}
      onSubmit={handleSubmit}
    ></DialogForm>
  );
});

export default EditModal;

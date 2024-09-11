import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { EditModalRef } from './type';
import DialogForm from '@/component/DialogForm';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { getRoleDataWithFlag } from '@/store/modules/role';
import { FormFieldItem } from 'jsonlee-ui-react/dist/types/form';
import {
  RoleCreateDTO,
  RoleItem,
  RoleUpdateDTO,
} from '@/types/api_modules/role';
import { TreeSelect } from 'jsonlee-ui-react';
import { DialogFormInstance } from '@/component/DialogForm/type';
import { RoleApi } from '@/api/modules/role';
import { message, Radio, SelectProps } from 'antd';
import { arrTransform } from 'jsonlee-utils';
import { RoleDataScopeTypes } from '@/dic/role';
import { RoleDataScope } from '@/enum/dic';

export interface Props {
  onSubmited?: () => void;
}

const initFormData = {
  parentId: 0,
  dataScope: RoleDataScope.CUSTOM,
};

const roleApi = new RoleApi();
const EditModal = forwardRef<EditModalRef, Props>(({ onSubmited }, ref) => {
  const dialogRef = useRef<DialogFormInstance<RoleItem>>(null);
  const [msgApi] = message.useMessage();
  const roleTree = useAppSelector((state) => state.role.tree);
  const roleOptions = useMemo<RoleItem[]>(() => {
    return [
      {
        id: 0,
        name: '根角色',
        children: roleTree || [],
      } as unknown as RoleItem,
    ];
  }, [roleTree]);
  const dispatch = useAppDispatch();
  const menuList = useAppSelector((state) => state.menu.flattenList);

  const menuOptions = useMemo<SelectProps['options']>(() => {
    return arrTransform(menuList, { label: 'meta.title', value: 'path' });
  }, [menuList]);

  const formFields = useMemo<FormFieldItem[]>(() => {
    return [
      {
        label: '父级角色',
        name: 'parentId',
        component: (value, onChange) => (
          <TreeSelect<RoleItem>
            options={roleOptions}
            placeholder={'请选择父级角色'}
            labelKey="name"
            valueKey="id"
            value={value}
            onChange={onChange}
          />
        ),
      },
      {
        label: '角色名称',
        name: 'name',
        inputProps: {
          placeholder: '请输入角色名称',
        },
        rules: [{ required: true, message: '请输入角色名称' }],
      },
      {
        label: '默认路由',
        name: 'defaultRouter',
        type: 'select',
        warning: '如果想要结果为"/", 请不要选择',
        inputProps: {
          options: menuOptions,
          placeholder: '请选择默认路由',
          allowClear: true,
        },
      },
      {
        label: '数据权限',
        name: 'dataScope',
        component: (value, onChange) => (
          <Radio.Group value={value} onChange={onChange}>
            {RoleDataScopeTypes.map((item) => (
              <Radio value={item.value} key={item.value}>
                {item.label}
              </Radio>
            ))}
          </Radio.Group>
        ),
      },
    ];
  }, [menuOptions, roleOptions]);

  const handleSubmit = useCallback(
    async (values: RoleItem) => {
      const { parentId, ...formData } = values;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      let fn: Function = roleApi.add<RoleCreateDTO>;
      if (typeof values.id !== 'undefined') {
        fn = roleApi.update<RoleUpdateDTO>;
      }
      try {
        const { msg } = await fn({ ...formData, parentId: parentId || null });
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

  const handleOpen = useCallback<
    DialogFormInstance<Partial<RoleCreateDTO | RoleUpdateDTO>>['open']
  >((title: string, data: Partial<RoleCreateDTO | RoleUpdateDTO> = {}) => {
    const formData = { ...data };
    if (formData.parentId === null) {
      formData.parentId = 0;
    }
    dialogRef.current?.open?.(title, formData as unknown as RoleItem);
  }, []);

  useEffect(() => {
    dispatch(getRoleDataWithFlag());
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      open: handleOpen,
      close: dialogRef.current?.close as () => void,
    }),
    [handleOpen],
  );
  return (
    <DialogForm<RoleItem>
      ref={dialogRef}
      fields={formFields}
      initialValues={initFormData}
      onSubmit={handleSubmit}
    ></DialogForm>
  );
});

export default EditModal;

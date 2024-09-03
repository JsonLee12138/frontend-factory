import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { Button, Input, Select, Space, Table, message } from 'antd';
import Icon from '@icon-park/react/es/all';
import { menuParamsTypes } from '@/dic/menu';
import { MenuParamsType } from '@/enum/dic';
import Form from '@/component/Form';
import TreeSelect from '@/component/TreeSelect';
import { useSafeState } from 'ahooks';
import { useAppSelector } from '@/hooks/store';
import { cloneDeep } from 'lodash';
import Dialog from '@/component/Dialog';
import { DialogInstance } from '@/component/Dialog/type';
import { FormFieldItem, FormInstance } from '@/component/Form/type';
import { MenuApi } from '@/api/modules/menu';
import {
  MenuCreateDTO,
  MenuItem,
  MenuMeta,
  MenuParams,
  MenuUpdateDTO,
} from '@/types/api_modules/menu';

export interface Props {
  onOk?: () => void;
}

interface ParamsItem extends Omit<MenuParams, 'menuId' | 'type'> {
  index: number;
  type: MenuParamsType | '';
}

const initFormData = {
  hidden: false,
  keepAlive: true,
};

const menuApi = new MenuApi();

const EditModal = forwardRef(({ onOk }: Props, ref) => {
  const dialogRef = useRef<DialogInstance>(null);
  const formRef = useRef<FormInstance>(null);
  const [msgApi] = message.useMessage();
  const [paramsList, setParamsList] = useSafeState<ParamsItem[]>([]);
  const [tempData, setTempData] =
    useSafeState<Partial<MenuUpdateDTO | MenuCreateDTO>>();
  const menuTree = useAppSelector((state) => state.menu.tree);
  const formFields = useMemo<FormFieldItem[]>(() => {
    return [
      {
        label: '父级菜单',
        name: 'parentId',
        component: (value, onChange) => (
          <TreeSelect<MenuItem>
            options={menuTree || []}
            placeholder={'请选择父级菜单'}
            labelKey="meta.title"
            valueKey="id"
            value={value}
            onChange={onChange}
          />
        ),
      },
      {
        label: '路由名称',
        name: 'name',
        inputProps: {
          placeholder: '请输入路由名称',
        },
        rules: [{ required: true, message: '请输入路由名称' }],
      },
      {
        label: '展示名称',
        name: 'title',
        inputProps: {
          placeholder: '请输入展示名称',
        },
        rules: [{ required: true, message: '请输入展示名称' }],
      },
      {
        label: '文件路径',
        name: 'component',
        inputProps: {
          placeholder: '请输入文件路径',
        },
      },
      {
        label: '图标',
        name: 'icon',
        inputProps: {
          placeholder: '请选择图标',
        },
      },
      {
        label: '是否隐藏',
        name: 'hidden',
        type: 'switch',
        inputProps: {
          checkedChildren: '隐藏',
          unCheckedChildren: '显示',
        },
        col: 0.5,
      },
      {
        label: '是否缓存',
        name: 'keepAlive',
        type: 'switch',
        inputProps: {
          checkedChildren: '是',
          unCheckedChildren: '否',
        },
        col: 0.5,
      },
      {
        label: '排序',
        name: 'sort',
        inputProps: {
          placeholder: '请输入排序值',
        },
      },
    ];
  }, [menuTree]);
  const handleSetParamsList = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (value: any, record: ParamsItem, key: keyof Omit<ParamsItem, 'index'>) => {
      setParamsList((prev) => {
        const newList = cloneDeep(prev);
        newList[record.index][key] = value;
        return newList;
      });
    },
    [setParamsList],
  );
  const addParams = useCallback(() => {
    setParamsList((prev) => {
      const index = prev.length;
      prev.push({
        key: '',
        type: '',
        index,
      });
      return prev;
    });
  }, [setParamsList]);
  const handleDeleteParams = useCallback(
    (record: ParamsItem) => {
      setParamsList((prev) => {
        return prev.filter((item) => item.index !== record.index);
      });
    },
    [setParamsList],
  );
  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);
  const open = useCallback(
    (title: string, data?: Partial<MenuUpdateDTO | MenuCreateDTO>) => {
      if (data) {
        setTempData(data);
        const defaultValues: Partial<MenuCreateDTO | MenuUpdateDTO> = {
          ...data,
          ...(data.meta || {}),
        };
        requestAnimationFrame(() => {
          formRef.current?.setFieldsValue(defaultValues);
        });
      }
      dialogRef.current?.open(title);
    },
    [setTempData],
  );
  const handleConfirm = useCallback(() => {
    formRef.current?.submit();
  }, [formRef]);
  const handleSubmit = useCallback(
    async (values: MenuUpdateDTO & MenuMeta) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      let fn: Function = menuApi.add<MenuCreateDTO>;
      const formData: MenuCreateDTO | MenuUpdateDTO = {
        name: values.name,
        path: values.path,
        component: values.component,
        sort: values.sort,
        params: values.params,
        meta: {
          title: values.title,
          icon: values.icon,
          hidden: values.hidden,
          keepAlive: values.keepAlive,
        },
        parentId: values.parentId,
      };
      if (typeof (tempData as Partial<MenuUpdateDTO>)?.id === 'number') {
        // 编辑
        (formData as MenuUpdateDTO).id = (tempData as MenuUpdateDTO).id;
        fn = menuApi.update<MenuUpdateDTO>;
      }
      try {
        const { msg } = await fn(formData);
        msgApi.success(msg);
        onOk?.();
      } catch {
        //
      } finally {
        dialogRef.current?.close();
      }
    },
    [msgApi, onOk, tempData],
  );
  const handleAfterClose = useCallback(() => {
    // 清空
    formRef.current?.reset();
  }, []);
  const paramsColumns = useMemo(
    () => [
      {
        title: '参数名称',
        dataIndex: 'name',
        key: 'name',
        render: (_: unknown, record: ParamsItem) => (
          <Input
            placeholder={'请输入参数名称'}
            className={'w-full'}
            onChange={(e) => handleSetParamsList(e.target.value, record, 'key')}
          />
        ),
      },
      {
        title: '参数类型',
        dataIndex: 'type',
        key: 'type',
        render: (_: unknown, record: ParamsItem) => (
          <Select
            options={menuParamsTypes}
            className={'min-w-[100px] w-full'}
            placeholder={'请选择参数类型'}
            onChange={(value) => handleSetParamsList(value, record, value)}
          />
        ),
      },
      {
        title: '操作',
        key: 'action',
        render: (_: unknown, record: ParamsItem) => (
          <Space>
            <Button
              danger
              type={'primary'}
              onClick={() => handleDeleteParams(record)}
            >
              删除
            </Button>
          </Space>
        ),
      },
    ],
    [handleDeleteParams, handleSetParamsList],
  );
  useImperativeHandle(
    ref,
    () => ({
      open,
      close,
    }),
    [close, open],
  );
  return (
    <Dialog
      ref={dialogRef}
      afterClose={handleAfterClose}
      onCancel={close}
      onConfirm={handleConfirm}
      width={'50%'}
    >
      <Form
        layout={'vertical'}
        fields={formFields}
        ref={formRef}
        onSubmit={handleSubmit}
        initialValues={initFormData}
      ></Form>
      <Button
        type={'primary'}
        icon={<Icon type={'plus'} />}
        className={'mb-2 mt-4'}
        onClick={addParams}
      >
        新增菜单参数
      </Button>
      <Table
        columns={paramsColumns}
        pagination={false}
        dataSource={paramsList}
        rowKey={(_record) => _record.index}
      ></Table>
    </Dialog>
  );
});

export default EditModal;

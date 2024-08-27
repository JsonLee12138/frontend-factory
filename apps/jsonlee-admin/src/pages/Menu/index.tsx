import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Button, Space, Switch, Table, message } from 'antd';
import Icon from '@icon-park/react/es/all';
import { ColumnsType } from 'antd/es/table';
import EditModal from '@/pages/Menu/EditModal.tsx';
import { Menu as MenuType } from '@/types/api_modules/menu.ts';
import { MenuApi } from '@/api/modules/menu.ts';
import { getMenuData } from '@/store/modules/menu.ts';
import { ConnectedProps } from '@/types/store.ts';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { EditModalRef } from './type';

const menuApi = new MenuApi();

interface DispatchProps {
  getMenuData: typeof getMenuData;
}
interface StateProps {
  menuTree: MenuType.Item[];
}
type FinalProps = ConnectedProps<StateProps, DispatchProps>;

const Menu = () => {
  const menuTree = useAppSelector(state=> state.menu.tree);
  const dispatch = useAppDispatch();
  const editRef = useRef<EditModalRef>(null);
  const columns = useMemo<ColumnsType<MenuType.Item>>(()=> [
    {
      title: 'id',
      dataIndex: 'id',
    },
    {
      title: '标题',
      dataIndex: 'title',
      render: (_, record) => <span>{record.meta?.title}</span>,
    },
    {
      title: '图标',
      dataIndex: 'icon',
      render: (_, record) => <Icon type={record.meta?.icon} />,
    },
    {
      title: '别名',
      dataIndex: 'name',
    },
    {
      title: '路由地址',
      dataIndex: 'path',
    },
    {
      title: '路由文件地址',
      dataIndex: 'component',
    },
    {
      title: '是否隐藏',
      dataIndex: 'hidden',
      render: (_, record) => (
        <Switch
          checkedChildren="隐藏"
          unCheckedChildren="开启"
          checked={record.meta?.hidden}
        />
      ),
    },
    {
      title: '排序',
      dataIndex: 'sort',
    },
    {
      title: '操作',
      render: (_, record: MenuType.Item) => (
        <Space>
          <Button
            type={'link'}
            onClick={() => {
              editRef.current?.open('修改菜单', record);
            }}
          >
            编辑
          </Button>
          <Button
            type={'link'}
            danger
            onClick={() => {
              menuApi.delete(record.id).then(() => {
                message.success('删除成功');
                dispatch(getMenuData())
              });
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ], [dispatch]);
  useEffect(()=> {
    dispatch(getMenuData())
  }, []);
  const handleSubmit = useCallback(async (values: Omit<MenuType.Item, 'meta' | 'children'> &
    MenuType.Meta &
    Partial<Pick<MenuType.Item, 'id'>>,
  done: () => void,)=> {
    let fn: Function = menuApi.add<MenuType.CreateDTO>;
    const formData: MenuType.CreateDTO | MenuType.UpdateDTO = {
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
    if (typeof values.id === 'number') {
      (formData as MenuType.UpdateDTO).id = values.id;
      fn = menuApi.update<MenuType.UpdateDTO>;
    }
    try {
      const { msg } = await fn(formData);
      message.success(msg);
    } catch (e) {
    } finally {
      done();
    }
  }, [])
  return (
    <>
      <div className={'m-3 p-3 rounded bg-white shadow overflow-hidden'}>
        <div className={'flex justify-between items-center'}>
          <Space className={'pb-3'}>
            <Button
              icon={<Icon type={'plus'} />}
              type="primary"
              onClick={() => {
                editRef.current?.open('新增菜单');
              }}
            >
              新增菜单
            </Button>
          </Space>
        </div>
        <Table
          className={'border rounded'}
          bordered={false}
          columns={columns}
          dataSource={menuTree}
          rowKey={'id'}
          pagination={false}
        />
      </div>
      <EditModal ref={editRef} onConfirm={handleSubmit} />
    </>
  );
};

export default Menu;

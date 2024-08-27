import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Button, Space, Switch, Table, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import EditModal from '@/pages/Menu/EditModal.tsx';
import { Menu as MenuType } from '@/types/api_modules/menu.ts';
import { MenuApi } from '@/api/modules/menu.ts';
import { getMenuData } from '@/store/modules/menu.ts';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { EditModalRef } from './type';
import Icon from '@/component/Icon';

const menuApi = new MenuApi();

const Menu = () => {
  const menuTree = useAppSelector(state => state.menu.tree);
  const dispatch = useAppDispatch();
  const editRef = useRef<EditModalRef>(null);
  const columns = useMemo<ColumnsType<MenuType.Item>>(() => [
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
      render: (_, record) => <Icon name={record.meta?.icon}>--</Icon>,
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
                dispatch(getMenuData());
              });
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ], [dispatch]);
  const handleRefresh = useCallback(() => {
    dispatch(getMenuData());
  }, []);
  useEffect(() => {
    dispatch(getMenuData());
  }, []);

  return (
    <>
      <div className={'m-3 p-3 rounded bg-white shadow overflow-hidden'}>
        <div className={'flex justify-between items-center'}>
          <Space className={'pb-3'}>
            <Button
              icon={<Icon name={'plus'} />}
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
      <EditModal ref={editRef} onOk={handleRefresh} />
    </>
  );
};

export default Menu;

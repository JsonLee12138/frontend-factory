import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Button, Space, Switch, message } from 'antd';
import EditModal from '@/pages/Menu/EditModal';
import { Menu as MenuType } from '@/types/api_modules/menu';
import { MenuApi } from '@/api/modules/menu';
import { getMenuData } from '@/store/modules/menu';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { EditModalRef } from './type';
import Icon from '@/component/Icon';
import ProTable from '@/component/ProTable';
import { ColumnItem } from '@/component/ProTable/types';

const menuApi = new MenuApi();

const Menu = () => {
  const menuTree = useAppSelector((state) => state.menu.tree);
  const dispatch = useAppDispatch();
  const editRef = useRef<EditModalRef>(null);
  const columns = useMemo<ColumnItem<MenuType.Item>[]>(
    () => [
      {
        title: 'id',
        dataIndex: 'id',
      },
      {
        title: '标题',
        dataIndex: 'title',
        ellipsis: true,
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
        ellipsis: true,
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
            defaultChecked={record.meta?.hidden}
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
    ],
    [dispatch],
  );
  const handleRefresh = useCallback(() => {
    dispatch(getMenuData());
  }, []);
  useEffect(() => {
    dispatch(getMenuData());
  }, []);

  return (
    <>
      <ProTable<MenuType.Item, unknown, false>
        columns={columns}
        data={menuTree}
        pagination={false}
        buttons={[
          <Button
            key={'add'}
            icon={<Icon name={'plus'} />}
            type="primary"
            onClick={() => {
              editRef.current?.open('新增菜单');
            }}
          >
            新增菜单
          </Button>,
        ]}
      />
      <EditModal ref={editRef} onOk={handleRefresh} />
    </>
  );
};

export default Menu;

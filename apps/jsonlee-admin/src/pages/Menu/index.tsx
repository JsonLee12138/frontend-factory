import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Button, Space, Switch, Table, message, Tooltip } from 'antd';
// import { ColumnsType } from 'antd/es/table';
import EditModal from '@/pages/Menu/EditModal';
import { Menu as MenuType } from '@/types/api_modules/menu';
import { MenuApi } from '@/api/modules/menu';
import { getMenuData } from '@/store/modules/menu';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { EditModalRef } from './type';
import Icon from '@/component/Icon';
import ProTable from '@/component/ProTable';
import { ColumnItem } from '@/component/ProTable/types';
import { treeBind } from '@/utils/tree';

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
        search: {
          inputProps: { placeholder: '请输入标题' },
        },
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
      <div className={'m-3 p-3 rounded bg-white shadow overflow-hidden'}>
        <h2 className={'mb-2 text-lg font-bold'}>菜单列表</h2>
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
          <Space className={'pb-3'}>
            <Tooltip title="显示搜索">
              <Button shape="circle" icon={<Icon name={'search'} />} />
            </Tooltip>
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
      <ProTable<MenuType.Item, unknown, false>
        columns={columns}
        // data={menuTree}
        pagination={false}
        request={menuApi.getListWithoutPagination<MenuType.Item>}
        resultTransform={(res) => {
          return {
            ...res,
            list: treeBind<MenuType.Item>(res.data),
          };
        }}
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

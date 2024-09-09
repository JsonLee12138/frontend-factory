import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Button, message, Modal, Space, Switch } from 'antd';
import EditModal from '@/pages/scan/Layout/SupperAdmin/Menu/EditModal';
import { MenuApi } from '@/api/modules/menu';
import { getMenuData } from '@/store/modules/menu';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { EditModalRef } from './type';
import Icon from '@/component/Icon';
// import ProTable from '@/component/ProTable';
import { ProTable } from 'jsonlee-ui-react';
import { ColumnItem } from '@/component/ProTable/types';
import { MenuItem } from '@/types/api_modules/menu';

const menuApi = new MenuApi();

const Menu = () => {
  const menuTree = useAppSelector((state) => state.menu.tree);
  const dispatch = useAppDispatch();
  const editRef = useRef<EditModalRef>(null);
  const loading = useAppSelector((state) => state.loading.loading);
  const columns = useMemo<ColumnItem<MenuItem>[]>(
    () => [
      {
        key: 'expandable',
        align: 'center',
        width: 30,
        fixed: 'left',
        render: (_, _record) => <></>,
      },
      {
        title: 'id',
        dataIndex: 'id',
        width: 80,
      },
      {
        title: '标题',
        dataIndex: 'title',
        ellipsis: true,
        width: 120,
        render: (_, record) => <span>{record.meta?.title}</span>,
      },
      {
        title: '图标',
        dataIndex: 'icon',
        width: 80,
        render: (_, record) => <Icon name={record.meta?.icon}>--</Icon>,
      },
      {
        title: '别名',
        dataIndex: 'name',
        ellipsis: true,
        width: 100,
      },
      {
        title: '路由地址',
        dataIndex: 'path',
        width: 120,
      },
      {
        title: '路由文件地址',
        dataIndex: 'component',
        width: 160,
      },
      {
        title: '是否隐藏',
        dataIndex: 'hidden',
        width: 90,
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
        width: 80,
      },
      {
        title: '操作',
        fixed: 'right',
        width: 180,
        render: (_, record: MenuItem) => (
          <Space>
            <a
              className={'text-[#1677ff]'}
              onClick={() => {
                editRef.current?.open('新增菜单', { parentId: record.id });
              }}
            >
              添加子菜单
            </a>
            <a
              className={'text-[#1677ff]'}
              onClick={() => {
                editRef.current?.open('修改菜单', record);
              }}
            >
              编辑
            </a>
            <a
              className={'text-[#ff4d4f] hover:text-red-300'}
              onClick={() => {
                Modal.confirm({
                  title: '删除菜单',
                  content: '确认删除该菜单吗？',
                  okType: 'danger',
                  onOk: () => {
                    menuApi.delete(record.id).then(() => {
                      message.success('删除成功');
                      dispatch(getMenuData());
                    });
                  },
                });
              }}
            >
              删除
            </a>
          </Space>
        ),
      },
    ],
    [dispatch],
  );
  const handleRefresh = useCallback(() => {
    dispatch(getMenuData());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getMenuData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ProTable<MenuItem, unknown, false>
        columns={columns}
        data={menuTree}
        pagination={false}
        loading={loading}
        expandable={{
          expandRowByClick: true,
          columnWidth: 80,
          expandIcon: ({ expanded, onExpand, record }) =>
            record.children && record.children.length ? (
              expanded ? (
                <Icon name="down" />
              ) : (
                <Icon name="right" onClick={(e) => onExpand(record, e)} />
              )
            ) : (
              <></>
            ),
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

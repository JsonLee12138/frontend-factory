import { IconPark } from 'jsonlee-ui-react';
import ProTable from '@/component/ProTable';
import { RoleItem } from '@/types/api_modules/role';
import { ColumnItem } from 'jsonlee-ui-react/dist/types/protable';
import { Button, message, Modal, Space } from 'antd';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { EditModalRef } from './type';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { getRoleData, getRoleDataWithFlag } from '@/store/modules/role';
import EditModal from './EditModal';
import { RoleApi } from '@/api/modules/role';

const roleApi = new RoleApi();

const Role = () => {
  // state
  const editRef = useRef<EditModalRef>(null);
  const dispatch = useAppDispatch();
  const roleData = useAppSelector((state) => state.role.tree);
  const columns = useMemo<ColumnItem<RoleItem>[]>(
    () => [
      {
        key: 'expandable',
        align: 'center',
        width: 30,
        fixed: 'left',
        render: (_, _record) => <></>,
      },
      {
        title: 'ID',
        dataIndex: 'id',
        // width: 100,
      },
      {
        title: '角色名称',
        dataIndex: 'name',
        // width: 100,
      },
      {
        title: '默认路由',
        dataIndex: 'defaultRouter',
        // width: 100,
      },
      {
        title: '操作',
        fixed: 'right',
        width: 180,
        render: (_, record: RoleItem) => (
          <Space>
            <a
              className={'text-[#1677ff]'}
              onClick={(e) => {
                e.stopPropagation();
                editRef.current?.open('新增角色', { parentId: record.id });
              }}
            >
              添加子角色
            </a>
            <a
              className={'text-[#1677ff]'}
              onClick={(e) => {
                e.stopPropagation();
                editRef.current?.open('修改角色', record);
              }}
            >
              编辑
            </a>
            <a
              className={'text-[#ff4d4f] hover:text-red-300'}
              onClick={(e) => {
                e.stopPropagation();
                Modal.confirm({
                  title: '删除角色',
                  content: '确认删除该角色吗？',
                  okType: 'danger',
                  onOk: () => {
                    roleApi.delete(record.id).then(() => {
                      message.success('删除成功');
                      dispatch(getRoleData());
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
  // function
  const handleRefresh = useCallback(() => {
    dispatch(getRoleData());
  }, [dispatch]);
  // useEffect
  useEffect(() => {
    dispatch(getRoleDataWithFlag());
  }, []);
  return (
    <>
      <ProTable<RoleItem>
        expandable={{
          expandRowByClick: true,
          columnWidth: 80,
          expandIcon: ({ expanded, onExpand, record }) =>
            record.children && record.children.length ? (
              expanded ? (
                <IconPark name="down" />
              ) : (
                <IconPark name="right" onClick={(e) => onExpand(record, e)} />
              )
            ) : (
              <></>
            ),
        }}
        buttons={[
          <Button
            key={'add'}
            icon={<IconPark name={'plus'} />}
            type="primary"
            onClick={() => {
              editRef.current?.open('新增角色');
            }}
          >
            新增角色
          </Button>,
        ]}
        data={roleData}
        pagination={false}
        columns={columns}
      />
      <EditModal ref={editRef} onSubmited={handleRefresh} />
    </>
  );
};

export default Role;

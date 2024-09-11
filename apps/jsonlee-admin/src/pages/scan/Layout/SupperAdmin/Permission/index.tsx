import { PermissionApi } from '@/api/modules/permission';
import { PermissionItem } from '@/types/api_modules/permission';
import { Button, message, Modal, Space } from 'antd';
import {
  ColumnItem,
  ProTableInstance,
} from 'jsonlee-ui-react/dist/types/protable';
import { useCallback, useMemo, useRef } from 'react';
import EditModal from './EditModal';
import { IconPark, ProTable } from 'jsonlee-ui-react';
import { EditModalRef } from './types';

const permissionApi = new PermissionApi();
const Permission = () => {
  // state
  const editRef = useRef<EditModalRef>(null);
  const tableRef = useRef<ProTableInstance>(null);
  // function
  const handleRefresh = useCallback(() => {
    tableRef.current?.refresh();
  }, []);
  const columns = useMemo<ColumnItem<PermissionItem>[]>(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        width: 120,
      },
      {
        title: '权限字符',
        dataIndex: 'name',
        search: {
          inputProps: {
            placeholder: '请输入权限字符',
          },
        },
      },
      {
        title: '描述',
        dataIndex: 'desc',
        search: {
          inputProps: {
            placeholder: '请输入描述',
          },
        },
      },
      {
        title: '分组',
        dataIndex: 'group',
        search: {
          inputProps: {
            placeholder: '请输入分组',
          },
        },
      },
      {
        title: '操作',
        width: 120,
        uniqueKey: 'controller',
        render: (_, record: PermissionItem) => (
          <Space>
            <a
              className={'text-[#1677ff]'}
              onClick={(e) => {
                e.stopPropagation();
                editRef.current?.open('修改权限', record);
              }}
            >
              编辑
            </a>
            <a
              className={'text-[#ff4d4f] hover:text-red-300'}
              onClick={(e) => {
                e.stopPropagation();
                Modal.confirm({
                  title: '删除权限',
                  content: '确认删除该权限吗？',
                  okType: 'danger',
                  onOk: () => {
                    permissionApi.delete(record.id).then(() => {
                      message.success('删除成功');
                      handleRefresh();
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
    [handleRefresh],
  );
  // function
  // useEffect
  return (
    <>
      <ProTable<PermissionItem>
        columns={columns}
        request={permissionApi.getList}
        buttons={[
          <Button
            type="primary"
            icon={<IconPark name={'plus'} />}
            onClick={() => editRef.current?.open('添加权限')}
          >
            新增权限
          </Button>,
        ]}
      />
      <EditModal ref={editRef} onSubmited={handleRefresh} />
    </>
  );
};

export default Permission;

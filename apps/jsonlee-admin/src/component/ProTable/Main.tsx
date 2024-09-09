import { Table, TableProps } from 'antd';
import { AnyObject } from 'antd/es/_util/type';
import { useProTableContext } from './context';
import { forwardRef, Ref } from 'react';
import { TableRef } from 'antd/es/table';

const TableMain = <T = AnyObject,>(
  {
    columns,
    dataSource,
    rowKey = 'id',
    bordered = false,
    pagination,
    ...props
  }: TableProps<T>,
  ref: Ref<TableRef>,
) => {
  // state
  const { loading } = useProTableContext()!;
  // function
  // useEffect
  return (
    <Table
      {...props}
      ref={ref}
      className={'border rounded w-full overflow-x-auto'}
      bordered={bordered}
      loading={loading}
      columns={columns}
      dataSource={dataSource}
      rowKey={rowKey}
      pagination={pagination}
    />
  );
};

export default forwardRef<TableRef>(TableMain);

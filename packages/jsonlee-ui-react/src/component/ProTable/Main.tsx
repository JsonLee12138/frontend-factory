import { Table, TableProps } from 'antd';
import { AnyObject } from 'antd/es/_util/type';
import { useProTableContext } from './context';
import { forwardRef, ReactNode, Ref, RefAttributes } from 'react';
import { TableRef } from 'antd/es/table';

const TableMain = forwardRef<TableRef, TableProps>(<T = AnyObject,>(
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
      className={'border rounded'}
      bordered={bordered}
      loading={loading}
      columns={columns}
      dataSource={dataSource}
      rowKey={rowKey}
      pagination={pagination}
    />
  );
});

export default TableMain as unknown as <T = AnyObject>(props: RefAttributes<TableRef> & TableProps<T>) => ReactNode;;

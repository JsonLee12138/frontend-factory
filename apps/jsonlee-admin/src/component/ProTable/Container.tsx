import ToolBar from '@/component/ProTable/ToolBar';
import { ContainerProps } from '@/component/ProTable/types';
import Buttons from '@/component/ProTable/Buttons';
import { AnyObject } from 'antd/es/_util/type';
import { useProTableContext } from './context';

const TableContainer = <T = AnyObject,>({
  buttons,
  headerRender,
  tableRender,
  paginationRender,
  searchRender,
  ...tableProps
}: ContainerProps<T>) => {
  // state
  const {
    showSearch,
    searchFields,
    tools,
    pagination,
    columns,
    loading,
    data,
  } = useProTableContext()!;
  // function
  // useEffect
  return (
    <>
      {searchFields && !!searchFields.length && showSearch && (
        <div className={'m-3 p-3 rounded bg-white shadow overflow-hidden'}>
          {searchRender?.(searchFields || [])}
        </div>
      )}
      <div className={'m-3 p-3 rounded bg-white shadow overflow-hidden'}>
        <div className={'flex justify-between items-center'}>
          {headerRender
            ? headerRender
            : [
                <Buttons key={'buttons'} buttons={buttons} />,
                <ToolBar key={'tools'} tools={tools} />,
              ]}
        </div>
        {tableRender?.({
          ...tableProps,
          columns,
          dataSource: data,
          loading,
          pagination: false,
        })}
        {pagination && (
          <div className={'mt-3'}>{paginationRender?.(pagination)}</div>
        )}
      </div>
    </>
  );
};

export default TableContainer;

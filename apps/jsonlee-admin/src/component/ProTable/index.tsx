import { ProTableInstance, ProTableProps, ScrollToProps } from './types';
import { AnyObject } from 'antd/es/_util/type';
import { PageParams } from '@/types/api';
import Provider from './Provider';
import TableContainer from './Container';
import SearchBar from './SearchBar';
import { Pagination } from 'antd';
import TableMain from './Main';
import { objOmit } from '@/utils/obj';
import {
  forwardRef,
  ReactNode,
  Ref,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { TableRef } from 'antd/es/table';

// eslint-disable-next-line react-refresh/only-export-components
const ProTable = <
  T = AnyObject,
  P = PageParams,
  Paginated extends boolean = true,
>(
  props: ProTableProps<T, P, Paginated>,
  ref: Ref<ProTableInstance>,
) => {
  const providerRef = useRef<Pick<ProTableInstance, 'refresh'>>(null);
  const tableRef = useRef<TableRef>(null);
  const tableProps = useMemo(
    () =>
      objOmit(props, [
        'columns',
        'dataSource',
        'request',
        'initParams',
        'paramsTransform',
        'resultTransform',
        'loading',
        'pagination',
      ]),
    [props],
  );
  const handleRefresh = useCallback(() => {
    providerRef.current?.refresh?.();
  }, []);
  const handleScrollTo = useCallback((props: ScrollToProps) => {
    tableRef.current?.scrollTo?.(props);
  }, []);
  useImperativeHandle(
    ref,
    () => ({
      refresh: handleRefresh,
      scrollTo: handleScrollTo,
    }),
    [handleRefresh, handleScrollTo],
  );
  return (
    <Provider<T, P, Paginated> {...props} ref={providerRef}>
      <TableContainer
        {...tableProps}
        buttons={props.buttons}
        searchRender={(feilds) => <SearchBar fields={feilds} />}
        tableRender={(_tableProps) => (
          <TableMain {..._tableProps} ref={tableRef} />
        )}
        paginationRender={(pagination) => <Pagination {...pagination} />}
      ></TableContainer>
    </Provider>
  );
};

export default forwardRef(ProTable) as unknown as <
  T = AnyObject,
  P = PageParams,
  Paginated extends boolean = true,
>(
  props: ProTableProps<T, P, Paginated> & { ref?: Ref<ProTableInstance> },
) => ReactNode;

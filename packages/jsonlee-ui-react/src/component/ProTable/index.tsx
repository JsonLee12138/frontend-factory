import type { ProTableInstance, ProTableProps, ScrollToProps, PageParams } from '@/types/protable';
import { AnyObject } from 'antd/es/_util/type';
import Provider from './Provider';
import TableContainer from './Container';
import SearchBar from './SearchBar';
import { Pagination } from 'antd';
import TableMain from './Main';
import { objOmit } from 'jsonlee-utils';
import {
  forwardRef,
  ReactNode,
  Ref,
  RefAttributes,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { TableRef } from 'antd/es/table';
import Buttons from './Buttons';
import { TooltipCol } from './TableCol';
import Title from './Title';
import ToolBar from './ToolBar';

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

interface ProTableWithChild {
  Buttons: typeof Buttons;
  Container: typeof TableContainer;
  Provider: typeof Provider;
  Table: typeof TableMain;
  Search: typeof SearchBar;
  Col: typeof TooltipCol;
  Title: typeof Title;
  Tools: typeof ToolBar;
}

const ProTableWithRef = forwardRef(ProTable) as unknown as (<
T = AnyObject,
P = PageParams,
Paginated extends boolean = true,
>(
props: ProTableProps<T, P, Paginated> & RefAttributes<ProTableInstance>,
) => ReactNode) & ProTableWithChild;

ProTableWithRef.Buttons = Buttons;
ProTableWithRef.Container = TableContainer;
ProTableWithRef.Provider = Provider;
ProTableWithRef.Table = TableMain;
ProTableWithRef.Search = SearchBar;
ProTableWithRef.Col = TooltipCol;
ProTableWithRef.Title = Title;
ProTableWithRef.Tools = ToolBar;

export default ProTableWithRef;

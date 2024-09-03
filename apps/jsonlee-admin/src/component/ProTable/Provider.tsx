import { useBoolean, useSafeState } from 'ahooks';
import { AnyObject } from 'antd/es/_util/type';
import {
  forwardRef,
  ReactNode,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
} from 'react';
import {
  ColumnItem,
  Pagination,
  ProTableInstance,
  ProviderProps,
  ToolsType,
} from './types';
import { ColumnProps, TablePaginationConfig } from 'antd/es/table';
import { TooltipCol } from './TableCol';
import { ListData, PageParams } from '@/types/api';
import { FormFieldItem } from '../Form/type';
import { context } from './context';

const defaultPagination: TablePaginationConfig = {
  showTotal: (total, range) =>
    `第 ${range[0]} - ${range[1]} 项/总共 ${total} 项`,
  showQuickJumper: true,
  showSizeChanger: true,
  align: 'end',
};

type RefInstance = Pick<ProTableInstance, 'refresh'>;

// eslint-disable-next-line react-refresh/only-export-components
const Provider = <
  T = AnyObject,
  P = PageParams,
  Paginated extends boolean = true,
>(
  {
    children,
    columns,
    tools,
    request,
    pagination: paginationProps = defaultPagination,
    data: dataSource,
    initParams,
    paramsTransform,
    loading: _loading,
  }: ProviderProps<T, P, Paginated>,
  ref: Ref<RefInstance>,
) => {
  const [data, setData] = useSafeState<T[]>([]);
  const [loading, setLoading] = useBoolean(false);
  const [showSearch, setShowSearch] = useBoolean(true);
  const [pagination, setPagination] = useSafeState<Pagination>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [params, setParams] = useSafeState<P>({} as P);
  const columnsUse = useMemo<ColumnProps<T>[]>(() => {
    return columns
      .filter((item) => !item.hidden)
      .map((item: ColumnItem<T>) => {
        const {
          render,
          ellipsis = !render,
          title,
          width: _width,
          search: _search,
          ...columnProps
        } = item;
        // const _width = width || 'auto';
        // 设置宽度, 根据表头的宽度来自列的width属性
        return {
          ...columnProps,
          title: <div className={'w-max'}>{title as string}</div>,
          ellipsis,
          render: (text: string, record: T, index: number) => {
            if (render) return render(text, record, index);
            return ellipsis ? <TooltipCol text={text} /> : <span>{text}</span>;
          },
        };
      });
  }, [columns]);
  const searchFields = useMemo(() => {
    return columns.reduce<FormFieldItem[]>((prev, curr: ColumnItem<T>) => {
      if (curr.search) {
        const { render, ...searchProps } = curr.search;
        prev.push({
          ...searchProps,
          name: (curr.dataIndex || curr.key) as string,
          component: render,
          label: curr.title as string,
        });
      }
      return prev;
    }, []);
  }, [columns]);
  const toolsUse = useMemo<ToolsType[]>(() => {
    if (tools) return tools;
    const _tools = new Set<ToolsType>(['refresh', 'column', 'searchToggle']);
    if (!searchFields || !searchFields.length) {
      _tools.delete('searchToggle');
    }
    if (!request) {
      _tools.delete('refresh');
    }
    return Array.from(_tools);
  }, [tools, searchFields, request]);
  const paginationUse = useMemo<TablePaginationConfig | false>(() => {
    if (paginationProps) {
      return {
        ...pagination,
        ...paginationProps,
      };
    }
    return false;
  }, [paginationProps, pagination]);
  // function
  const handelGetParams = useCallback(
    (_params: Partial<P> = {}): Partial<P> => {
      const res: Partial<P> & Partial<PageParams> = { ..._params };
      if (initParams) {
        Object.assign(res, initParams);
      }
      Object.assign(res, params);
      if (paginationUse === false) {
        res.paginated = false;
      } else {
        res.page = paginationUse.current;
        res.pageSize = paginationUse.pageSize;
      }
      if (paramsTransform) {
        return paramsTransform(res);
      }
      return res;
    },
    [initParams, paginationUse, params, paramsTransform],
  );
  const handleRequest = useCallback(
    async (params?: Partial<P>) => {
      if (request) {
        console.log(pagination, 'pagination');

        setLoading.setTrue();
        const _params = handelGetParams(params);
        try {
          const res = await request(_params);
          if (paginationProps) {
            const {
              list,
              page: _page,
              pageSize: _pageSize,
              total: _total,
            } = res.data as ListData<T>;
            setData(list);
            setPagination({
              current: _page,
              pageSize: _pageSize,
              total: _total,
            });
            return;
          }
          setData(res.data as T[]);
        } catch (error) {
          if (import.meta.env.DEV) {
            console.error('get list data error:', error);
          }
        } finally {
          setLoading.setFalse();
        }
      }
    },
    [
      handelGetParams,
      pagination,
      paginationProps,
      request,
      setData,
      setLoading,
      setPagination,
    ],
  );
  const handleRefresh = useCallback(() => {
    handleRequest(handelGetParams());
  }, [handelGetParams, handleRequest]);
  // effect
  useEffect(() => {
    setData(dataSource || []);
  }, [dataSource]);
  useEffect(() => {
    setLoading.set(!!_loading);
  }, [_loading]);
  useEffect(() => {
    handleRefresh();
  }, []);
  // export
  useImperativeHandle<RefInstance, RefInstance>(
    ref,
    () => ({
      refresh: handleRefresh,
    }),
    [handleRefresh],
  );
  return (
    <context.Provider
      value={{
        data,
        loading,
        setLoading,
        pagination: paginationUse,
        setPagination,
        columns: columnsUse,
        searchFields,
        tools: toolsUse,
        getTableList: handleRequest,
        getParams: handelGetParams,
        setShowSearch,
        showSearch,
        refresh: handleRefresh,
        setParams,
      }}
    >
      {children}
    </context.Provider>
  );
};

export default forwardRef(Provider) as unknown as <
  T = AnyObject,
  P = PageParams,
  Paginated extends boolean = true,
>(
  props: ProviderProps<T, P, Paginated>,
) => ReactNode;

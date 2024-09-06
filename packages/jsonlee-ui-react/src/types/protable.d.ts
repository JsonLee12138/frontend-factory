import { Key, ReactNode, Ref, RefAttributes } from 'react';
import { AnyObject } from 'antd/es/_util/type';
import { FormFieldItem } from './form';
import { ColumnProps, TableRef } from 'antd/es/table';
import { TableProps } from 'antd/lib';

export interface PageParams {
  page: number;
  pageSize: number;
  paginated: boolean;
}

export interface Result<T = AnyObject> {
  code: number;
  data: T;
  msg: string;
}

export interface ListData<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ScrollToProps {
  index: number;
  key?: Key;
  top: number;
}
export interface ProTableInstance {
  refresh: () => void;
  scrollTo: (props: ScrollToProps) => void;
}
export interface UseBooleanActions {
  set: (value: boolean) => void;
  setTrue: () => void;
  setFalse: () => void;
  toggle: () => void;
}
export interface ProTableContextState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  loading: boolean;
  showSearch: boolean;
  // pagination: Pagination;
  pagination: TableProps['pagination'];
  setPagination: (
    pagination: Pagination | ((props: Pagination) => Pagination),
  ) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTableList: (params?: any) => void;

  // searchParams: any;
  setLoading: UseBooleanActions;
  setShowSearch: UseBooleanActions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnProps<any>[];
  searchFields: FormFieldItem[];
  tools: ToolBarProps['tools'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getParams: (params?: any) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setParams: (params: any) => void;
  refresh: () => void;
}

export interface Pagination {
  current: number;
  pageSize: number;
  total: number;
}

export type ProTableProps<
  T = AnyObject,
  P = PageParams,
  Paginated extends boolean = true,
> = Omit<TableProps, 'columns'> & {
  columns: ColumnItem<T>[];
  data?: T[];
  request?: (
    props: Partial<P>,
  ) => PromiseLike<Result<Paginated extends false ? T[] : ListData<T>>>;
  initParams?: Partial<P>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paramsTransform?: (params: Partial<P>) => any;
  resultTransform?: (
    data: Result<Paginated extends false ? T[] : ListData<T>>,
  ) => Result<Paginated extends false ? T[] : ListData<T>>;
  headerRender?: ReactNode;
  tools?: ToolBarProps['tools'];
  buttons?: ButtonsProps['buttons'];
};

export type ContainerProps<T = AnyObject> = Omit<
  TableProps<T>,
  'columns' | 'pagination' | 'loading' | 'dataSource'
> & {
  buttons: ButtonsProps['buttons'];
  headerRender?: ReactNode;
  searchFields?: FormFieldItem[];
  showSearch?: boolean;
  searchRender?: (props: FormFieldItem[]) => ReactNode;
  tableRender?: (props: TableProps<T>) => ReactNode;
  paginationRender?: (props: TableProps['pagination']) => ReactNode;
};

export type ProviderProps<
  T = AnyObject,
  P = PageParams,
  Paginated extends boolean = true,
> = ProTableProps<T, P, Paginated> & {
  children: ReactNode;
  ref: Ref<Pick<ProTableInstance, 'refresh'>>;
};

export interface TooltipBarProps {
  text?: ReactNode | string;
}

export type ToolsType = 'searchToggle' | 'refresh' | 'column';

export interface ToolBarProps {
  tools?: ToolsType[] | false;
}

export interface ButtonsProps {
  buttons?: ReactNode[];
}

export interface TitleProps {
  title: string;
}

export interface SearchBarProps {
  fields: FormFieldItem[];
}

export type SearchProps = Pick<
  FormFieldItem,
  'type' | 'col' | 'inputProps' | 'value' | 'onChange'
> & {
  render?: FormFieldItem['component'];
};

export type ColumnItem<T = AnyObject> = ColumnProps<T> & {
  search?: SearchProps;
  type?: string;
};

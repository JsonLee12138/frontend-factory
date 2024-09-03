import { AnyObject } from './global';

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

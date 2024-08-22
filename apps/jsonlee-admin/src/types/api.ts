export interface PageParams {
  page: number;
  pageSize: number;
  paginated: boolean;
}

export interface Result<T = any> {
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

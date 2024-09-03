import { post, get, put, del } from '@/utils/request';
import { ListData, PageParams } from '@/types/api';

export class BaseApi {
  protected basePath: string = '';

  constructor(path: string) {
    this.basePath = path;
  }

  public static BaseModel: {
    createTime: string;
    updateTime: string | null;
  };
  public add = <D extends object, T = unknown>(data: D) =>
    post<T>(this.basePath, data);

  public delete = <T, I extends string | number = string>(ids: I | I[]) =>
    del<T>(`${this.basePath}/${Array.isArray(ids) ? ids.join(',') : ids}`);

  public update = <D extends object, T = unknown>(data: D) =>
    put<T>(`${this.basePath}`, data);

  public getItem = <T, I extends string | number = string>(id: I) =>
    get<T>(`${this.basePath}/${id}`);

  public getList = <T, P = object>(
    params: P = {} as P & Partial<PageParams>,
  ) => {
    return get<ListData<T>>(this.basePath, params as object);
  };
  public getListWithoutPagination = <T, P = object>(params: P = {} as P) => {
    return get<T[]>(this.basePath, { ...params, paginated: false } as object);
  };
}

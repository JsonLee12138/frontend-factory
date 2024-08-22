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
  public add = <T, P extends object>(data: P) => post<T>(this.basePath, data);

  public delete = <T, I extends string | number = string>(ids: I | I[]) =>
    del<T>(`${this.basePath}/${Array.isArray(ids) ? ids.join(',') : ids}`);

  public update = <T, P extends object>(data: P) =>
    put<T>(`${this.basePath}`, data);

  public getItem = <T, I extends string | number = string>(id: I) =>
    get<T>(`${this.basePath}/${id}`);

  public getList = <T, P extends Partial<PageParams>>(params: P = {} as P) => {
    if (params.paginated) {
      return get<ListData<T>>(`${this.basePath}/list`, params);
    }
    return get<T[]>(`${this.basePath}/list`, params);
  };
}
